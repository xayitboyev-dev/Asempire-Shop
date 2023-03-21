const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('buy');
const { buy } = require("../keyboards/keyboard");
const { review, payment } = require("../keyboards/inline");
const { TARIFF, CHECKOUT_PAYME, PAYME_API, CHECKOUT_UZUM } = require("../config/config.json");
const User = require("../models/User");
const paymePay = require("../utils/paymePay");
const uzumPay = require("../utils/uzumPay");
const axios = require("axios");
const start = require("../utils/start");
const file = require("../utils/file");
const { v4 } = require("uuid");
const langs = require("../config/langs");
const checkUzum = require('../utils/checkUzum');
const { Input } = require("telegraf");
const path = require("path");

scene.enter(async (ctx) => {
    try {
        await ctx.replyWithHTML(langs.enterTariff[ctx.session.lang], buy(ctx.session.lang));
    } catch (error) {
        console.log(error);
    };
});

scene.command("/admin", (ctx) => ctx.scene.enter("admin:main"));

scene.command("language", (ctx) => ctx.scene.enter("lang"));

scene.start(start);

scene.hears(Object.values(langs.back), start);

scene.on("text", async (ctx) => {
    try {
        const { text } = ctx.message;
        const tariff = TARIFF.find((item) => item.name === text);
        if (tariff) {
            await ctx.replyWithPhoto(Input.fromLocalFile(path.join(__dirname, "..", "assets", "uc.jpg"), "uc_logo"), { caption: langs.tariffReview[ctx.session.lang](tariff, ctx.session.pubgId), reply_markup: { inline_keyboard: review(tariff.count, ctx.session.lang), resize_keyboard: true }, });
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
                    await ctx.editMessageCaption(langs.waitingForPay[ctx.session.lang](tariff, ctx.session.pubgId, payBy.toUpperCase()), payment({
                        url: (payBy === "payme" ? CHECKOUT_PAYME : CHECKOUT_UZUM) + tid,
                        uuid
                    }, ctx.session.lang));
                } catch (error) {
                    console.log("ERR 1", error);
                    try {
                        await ctx.editMessageCaption(error);
                    } catch (error) {
                        console.log(error);
                    };
                };
            }).catch(async (error) => {
                console.log("ERR 2", error);
                try {
                    await ctx.editMessageCaption(langs.payTypeError[ctx.session.lang]);
                } catch (error) {
                    console.log(error);
                };
            });
        } else {
            try {
                await ctx.editMessageCaption(langs.tariffNotFound[ctx.session.lang]);
            } catch (error) {
                console.log(error);
            };
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
            const transaction = user.transactions.find((item) => item.uuid == uuid);
            async function success() {
                await ctx.deleteMessage();
                await ctx.reply(langs.successfullyPay[ctx.session.lang]);
                file.addTask({ chatId: ctx.from.id, id: transaction.id, count: transaction.count, pubgId: transaction.pubgId, status: "waiting" });
            };
            async function ctxError() {
                await ctx.answerCbQuery(langs.notPaid[ctx.session.lang], { show_alert: true });
            };
            if (transaction) {
                if (transaction.payBy === "payme") {
                    const response = await axios.post(PAYME_API, { method: "cheque.get", params: { id: transaction.tid } });
                    if (response.data?.result?.cheque?.pay_time > 0) success();
                    else ctxError();
                } else if (transaction.payBy === "uzum") {
                    checkUzum(transaction.tid).then(success).catch(ctxError);
                };
            } else throw "Not found";
        } else throw "Not found";
    } catch (error) {
        try {
            await ctx.editMessageCaption("Transaction not found!");
        } catch (error) {
            console.log(error);
        };
    };
});

module.exports = scene; 