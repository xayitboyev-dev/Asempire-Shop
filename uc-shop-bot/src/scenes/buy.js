const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('buy');
const { buy } = require("../keyboards/keyboard");
const { review, payment } = require("../keyboards/inline");
const { TARIFF, CHECKOUT_PAYME, PAYME_API } = require("../config/config.json");
const User = require("../models/User");
const pay = require("../utils/pay");
const axios = require("axios");
const start = require("../utils/start");
const file = require("../utils/file");

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

scene.action(/^buy_(.+)$/, async (ctx) => {
    try {
        const count = parseInt(ctx.match[1]);
        const tariff = TARIFF.find((item) => count == item.count);

        if (tariff) {
            pay(tariff.price).then(async (respone) => {
                try {
                    const tid = respone?.result?.cheque?._id;
                    const user = await User.findOne({ uid: ctx.from.id });
                    user.transactions.push({ name: tariff.name, count: tariff.count, tid, pubgId: +ctx.session.pubgId });
                    await user.save();
                    await ctx.editMessageText(`Tarif: ${tariff.name}\nUC soni: ${tariff.count}\nNarxi: ${tariff.priceName} UZS\nPubg id: ${ctx.session.pubgId}\n\nTo'lov qilinishi kutilmoqda.`, payment({
                        url: CHECKOUT_PAYME + tid,
                        tid
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
        const payId = ctx.match[1];
        const user = await User.findOne({ uid: ctx.from.id });

        if (user) {
            const transaction = user.transactions.find((item) => item.tid === payId);
            if (transaction) {
                const respone = await axios.post(PAYME_API, { method: "cheque.get", params: { id: payId } });
                if (respone) {
                    if (respone.data?.result?.cheque?.pay_time > 0) {
                        ctx.deleteMessage();
                        ctx.reply(`✅ Pul to'ladingiz. Tez orada uc tashlab beramiz va xabar beramiz. Hisobingizga UC tushmagan hollarda admin bilan bog'laning.`);
                        file.addTask({ chatId: ctx.from.id, id: transaction.id, count: transaction.count, pubgId: transaction.pubgId, status: "waiting" });
                    } else {
                        ctx.answerCbQuery("❗️ To'lov qilinmagan.", { show_alert: true });
                    };
                } else throw "Not found";
            } else throw "Not found";
        } else throw "Not found";
    } catch (error) {
        ctx.editMessageText("Transaction not found!");
    };
});

module.exports = scene; 