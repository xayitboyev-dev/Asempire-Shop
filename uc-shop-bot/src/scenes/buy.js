const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('buy');
const { buy } = require("../keyboards/keyboard");
const { review, payment } = require("../keyboards/inline");
const { TARIFF, CHECKOUT_PAYME, PAYME_API, CHECKOUT_UZUM, UZUMBANK_API } = require("../config/config.json");
const User = require("../models/User");
const paymePay = require("../utils/paymePay");
const uzumPay = require("../utils/uzumPay");
const axios = require("axios");
const start = require("../utils/start");
const file = require("../utils/file");
const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");
const proxy = require("../config/proxy.json");
const langs = require("../config/langs");

scene.enter(async (ctx) => {
    await ctx.replyWithHTML(langs.enterTariff[ctx.session.lang], buy(ctx.session.lang));
});

scene.command("admin", async (ctx) => {
    await ctx.scene.enter("admin:main");
});

scene.start(start);

scene.hears(Object.values(langs.back), start);

scene.on("text", async (ctx) => {
    try {
        const { text } = ctx.message;
        const tariff = TARIFF.find((item) => item.name === text);
        if (tariff) {
            await ctx.reply(langs.tariffReview[ctx.session.lang](tariff, ctx.session.pubgId), review(tariff, ctx.session.lang));
        } else {
            await ctx.reply(langs.tariffNotFound[ctx.session.lang]);
        };
    } catch (error) {
        console.log(error);
    };
});

scene.action(/^(buyByPayme_|buyByUzum_)(.+)$/, async (ctx) => {
    try {
        const payBy = ctx.match[1] === "buyByPayme_" ? "payme" : ctx.match[1] === "buyByUzum_" ? "uzum" : "other";
        const count = parseInt(ctx.match[2]);
        const tariff = TARIFF.find((item) => count == item.count);

        if (tariff) {
            const pay = payBy === "payme" ? paymePay(tariff.price) : uzumPay(tariff.price);
            pay.then(async (tid) => {
                console.log(tid);
                try {
                    const user = await User.findOne({ uid: ctx.from.id });
                    const uuid = v4();
                    user.transactions.push({ uuid, payBy, name: tariff.name, count: tariff.count, tid, pubgId: +ctx.session.pubgId });
                    await user.save();
                    await ctx.editMessageText(langs.waitingForPay[ctx.session.lang](tariff, ctx.session.pubgId, payBy.toUpperCase()), payment({
                        url: (payBy === "payme" ? CHECKOUT_PAYME : CHECKOUT_UZUM) + tid,
                        uuid
                    }, ctx.session.lang));
                } catch (error) {
                    console.log("ERR 1", error);
                    ctx.editMessageText("Transaction error!");
                };
            }).catch((error) => {
                console.log("ERR 1", error);
                if (error?.err_message) {
                    ctx.editMessageText(error?.err_message);
                } else {
                    ctx.editMessageText("Transaction error!");
                };
            });
        } else {
            await ctx.editMessageText(langs.tariffNotFound[ctx.session.lang]);
        };
    } catch (error) {
        console.log(error);
    };
});

scene.action(/^check_(.+)$/, async (ctx) => {
    try {
        const uuid = ctx.match[1];
        const user = await User.findOne({ uid: ctx.from.id });

        if (user) {
            const transaction = user.transactions.find((item) => item.uuid === uuid);
            function success() {
                ctx.deleteMessage();
                ctx.reply(langs.successfullyPay[ctx.session.lang]);
                file.addTask({ chatId: ctx.from.id, id: transaction.id, count: transaction.count, pubgId: transaction.pubgId, status: "waiting" });
            };
            function ctxError() {
                ctx.answerCbQuery(langs.notPaid[ctx.session.lang], { show_alert: true });
            };
            if (transaction) {
                if (transaction.payBy === "payme") {
                    const response = await axios.post(PAYME_API, { method: "cheque.get", params: { id: transaction.tid } });
                    console.log(response.data);
                    if (response.data?.result?.cheque?.pay_time > 0) success();
                    else ctxError();
                } else if (transaction.payBy === "uzum") {
                    fs.readFile(path.join(__dirname, "..", "config", "uzumConfig.json"), "utf-8", async (err, data) => {
                        try {
                            if (err) ctxError();
                            else {
                                const uzumConfig = JSON.parse(data);
                                const response = await axios.get(UZUMBANK_API + transaction.tid, { headers: uzumConfig, proxy });
                                console.log(response.data);
                                if (response.data?.data?.expressStatus == "ACTIVE") ctxError();
                            };
                        } catch (error) {
                            console.log(error);
                            if (error.response?.data?.data?.expressStatus != "ACTIVE") success();
                            ctxError();
                        };
                    })
                };
            } else throw "Not found";
        } else throw "Not found";
    } catch (error) {
        console.log(error);
        ctx.editMessageText("Transaction not found!");
    };
});

module.exports = scene; 