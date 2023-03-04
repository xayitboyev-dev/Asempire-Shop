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

scene.enter(async (ctx) => {
    try {
        await ctx.replyWithHTML(`Tarifflardan birini tanlang`, buy());
    } catch (error) {
        console.log(error);
    };
});

scene.command("admin", async (ctx) => {
    try {
        await ctx.scene.enter("admin:main");
    } catch (error) {
        console.log(error);
    };
});

scene.start(start);

scene.hears("◀️ Ortga qaytish", start);

scene.on("text", async (ctx) => {
    try {
        const { text } = ctx.message;
        const tariff = TARIFF.find((item) => item.name === text);
        if (tariff) {
            await ctx.reply(`Tarif: ${tariff.name}\nUC soni: ${tariff.count}\nNarxi: ${tariff.priceName} UZS\nPubg id: ${ctx.session.pubgId}`, review(tariff));
        } else {
            await ctx.reply("Bunday tarif mavjud emas!");
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
                    await ctx.editMessageText(`Tarif: ${tariff.name}\nUC soni: ${tariff.count}\nNarxi: ${tariff.priceName} UZS\nPubg id: ${ctx.session.pubgId}\nTo'lov turi: ${payBy}\n\nTo'lov qilinishi kutilmoqda.`, payment({
                        url: (payBy === "payme" ? CHECKOUT_PAYME : CHECKOUT_UZUM) + tid,
                        uuid
                    }));
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
            await ctx.editMessageText("Bunday tarif mavjud emas!");
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
                ctx.reply(`✅ Pul to'ladingiz. Tez orada uc tashlab beramiz va xabar beramiz. Hisobingizga UC tushmagan hollarda admin bilan bog'laning.`);
                file.addTask({ chatId: ctx.from.id, id: transaction.id, count: transaction.count, pubgId: transaction.pubgId, status: "waiting" });
            };
            function ctxError() {
                ctx.answerCbQuery("❗️ To'lov qilinmagan.", { show_alert: true });
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
                                const response = await axios.get(UZUMBANK_API + transaction.tid, { headers: uzumConfig });
                                console.log(response.data);
                                if (response.data?.data?.expressStatus == "ACTIVE") ctxError();
                            };
                        } catch (error) {
                            console.log(error);
                            if (error.data?.data?.expressStatus != "ACTIVE") success();
                            ctxError();
                        };
                    })
                };
            } else throw "Not found";
        } else throw "Not found";
    } catch (error) {
        ctx.editMessageText("Transaction not found!");
    };
});

module.exports = scene; 