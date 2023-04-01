const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('products');
const { catalog } = require('../admin/keyboards/keyboard');
const Product = require("../models/Product");
const User = require("../models/User");
const { review, payment } = require("../keyboards/inline");
const langs = require('../config/langs');
const paymePay = require("../utils/paymePay");
const uzumPay = require("../utils/uzumPay");
const axios = require("axios");
const { CHECKOUT_PAYME, CHECKOUT_UZUM, PAYME_API } = require("../config/config.json");
const { v4 } = require("uuid");
const checkUzum = require('../utils/checkUzum');

scene.enter(async (ctx) => {
    try {
        const products = await Product.find({ category: ctx.scene?.state?.category });
        await ctx.reply(langs.products[ctx.session.lang], catalog(products, false, ctx.session.lang));
    } catch (error) {
        console.log(error);
    };
});

scene.hears(Object.values(langs.back), (ctx) => ctx.scene.enter("main"));

scene.command("language", (ctx) => ctx.scene.enter("lang"));

scene.command("/admin", (ctx) => ctx.scene.enter("admin:main"));

scene.action(/^(buyByPayme_|buyByUzum_)(.+)$/, async (ctx) => {
    try {
        const payBy = ctx.match[1] === "buyByPayme_" ? "payme" : ctx.match[1] === "buyByUzum_" ? "uzum" : "other";
        const product = await Product.findById(ctx.match[2]);

        if (product) {
            const pay = payBy === "payme" ? paymePay(product.price) : uzumPay(product.price);
            pay.then(async (tid) => {
                try {
                    const user = await User.findOne({ uid: ctx.from.id });
                    const uuid = v4();
                    user.transactions.push({ uuid, payBy, name: product.name, productId: product.id, price: product.price, tid });
                    await user.save();
                    await ctx.editMessageCaption(langs.productViewWaiting[ctx.session.lang](product, payBy.toUpperCase()), payment({
                        url: (payBy === "payme" ? CHECKOUT_PAYME : CHECKOUT_UZUM) + tid,
                        uuid
                    }, ctx.session.lang));
                } catch (error) {
                    console.log("ERR 1", error);
                    ctx.editMessageCaption(error);
                };
            }).catch((error) => {
                console.log("ERR 2", error);
                ctx.editMessageCaption(langs.payTypeError[ctx.session.lang]);
            });
        } else {
            await ctx.editMessageCaption(langs.tariffNotFound[ctx.session.lang]);
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
            const product = await Product.findById(transaction.productId);
            const mapped = product.details.map((item) => item.key + ": " + item.value);
            const details = mapped.join("\n");

            async function success() {
                try {
                    await ctx.editMessageCaption(langs.productPaid[ctx.session.lang](product, transaction, details, new Date().toLocaleDateString()), { parse_mode: "HTML" });
                    await Product.findByIdAndDelete(product.id);
                    ctx.scene.enter("products", { category: ctx.scene?.state?.category });
                } catch (error) {
                    console.log(error);
                };
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
        console.log(error);
        await ctx.editMessageCaption("Transaction error!");
    };
});

scene.on("text", async (ctx) => {
    const product = await Product.findOne({ name: ctx.message?.text });

    if (product) {
        await ctx.replyWithPhoto({ url: product.image_link }, { caption: langs.productView[ctx.session.lang](product), reply_markup: { inline_keyboard: review(product.id, ctx.session.lang), resize_keyboard: true } });
    } else {
        await ctx.reply("Product topilmadi!");
    };
});

module.exports = scene;