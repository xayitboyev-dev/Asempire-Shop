const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const { main } = require("../keyboards/keyboard");
const { review, buy } = require("../keyboards/inline");
const { TARIFF, CHECKOUT_PAYME, PAYME_API } = require("../config/config.json");
const User = require("../models/User");
const pay = require("../utils/pay");
const axios = require("axios");

scene.enter(async (ctx) => {
    try {
        await ctx.replyWithHTML(`Hohlagancha uc sotib olishingiz mumkin. Ishonchi va xavfsiz!`, main());
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

scene.on("text", async (ctx) => {
    try {
        const { text } = ctx.message;
        const tariff = TARIFF.find((item) => item.name === text);
        if (tariff) {
            await ctx.reply(`Tarif: ${tariff.name}\nUC soni: ${tariff.count}\nNarxi: ${tariff.priceName}\n`, review(tariff));
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
                    user.transactions.push({ name: tariff.name, count: tariff.count, tid });
                    await user.save();
                    await ctx.editMessageText(`Tarif: ${tariff.name}\nUC soni: ${tariff.count}\nNarxi: ${tariff.priceName}\n\nTo'lov qilinishi kutilmoqda.`, buy({
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
                const { data } = await axios.post(PAYME_API, {
                    method: "cheque.get",
                    params: {
                        id: payId
                    }
                })
                if (data?.result?.cheque?.pay_time > 0) {
                    ctx.editMessageText(`✅ To'landi ${transaction.count} UC tashlab berdik!`);
                } else {
                    ctx.answerCbQuery("❗️ To'lov qilinmagan.")
                };
            } else throw "Not found";
        } else throw "Not found";
    } catch (error) {
        ctx.editMessageText("Transaction not found!");
    };
})

module.exports = scene; 