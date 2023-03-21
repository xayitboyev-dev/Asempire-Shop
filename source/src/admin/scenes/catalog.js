const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:catalog');
const { catalog } = require('../keyboards/keyboard');
const auth = require("../middlewares/auth");
const Category = require("../../models/Category.js");
const langs = require('../../config/langs');
const start = require("../../utils/start");

scene.enter(auth, async (ctx) => {
    const categories = await Category.find();
    await ctx.reply('Categoriyalar:', catalog(categories, true, ctx.session.lang));
});

scene.start(start);

scene.hears("➕ Qo'shish", (ctx) => ctx.scene.enter("admin:catalog:add"));

scene.hears(Object.values(langs.back), (ctx) => ctx.scene.enter("admin:main"));

scene.on("text", async (ctx) => {
    const category = await Category.findOne({ name: ctx.message.text });
    if (category) {
        ctx.scene.enter("admin:catalog:review", { categoryId: category.id });
    } else {
        ctx.reply("Categoriya topilmadi!");
    };
});

module.exports = scene;