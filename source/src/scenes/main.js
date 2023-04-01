const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const { Input } = require("telegraf");
const path = require("path");
const langs = require("../config/langs");
const { main } = require("../keyboards/keyboard");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");
const updateUser = require("../utils/updateUser");
const start = require("../utils/start");

scene.enter(async (ctx) => {
    try {
        await User.create({ ...ctx.from, uid: ctx.from.id });
        const admins = await User.find({ role: "admin" });
        admins.forEach((admin) => ctx.forwardMessage(admin.uid));
        console.log(ctx.from.id, 'saved');
    } catch (error) {
        if (error.code == 11000) updateUser(ctx.from.id, { ...ctx.from, uid: ctx.from.id });
    };

    try {
        const categories = await Category.find();
        await ctx.replyWithPhoto(Input.fromLocalFile(path.join(__dirname, "..", "assets", "logo.png"), "logo"), { caption: langs.welcome[ctx.session.lang] });
        await ctx.reply(langs.mainMenu[ctx.session.lang], main(categories, ctx.session.lang));
    } catch (error) {
        console.log(error);
    };
});

scene.start(start);

scene.command("language", (ctx) => ctx.scene.enter("lang"));

scene.command("/admin", (ctx) => ctx.scene.enter("admin:main"));

scene.hears(Object.values(langs.buyUc), (ctx) => ctx.scene.enter("buy"));

scene.on("text", async (ctx) => {
    try {
        const name = ctx.message?.text;
        const category = await Category.findOne({ name });
        const products = await Product.find({ category: category?.name });

        if (category) {
            if (products.length) {
                ctx.scene.enter("products", { category: category.name });
            } else {
                await ctx.reply(langs.productsNotAvailable[ctx.session.lang]);
            };
        } else {
            await ctx.reply(langs.categoryNotFound[ctx.session.lang]);
        };
    } catch (error) {
        console.log(error);
    };
});

module.exports = scene; 