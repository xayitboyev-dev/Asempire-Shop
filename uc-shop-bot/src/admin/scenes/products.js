const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:products');
const { catalog } = require('../keyboards/keyboard');
const auth = require("../middlewares/auth");
const Category = require("../../models/Category.js");

scene.enter(auth, async (ctx) => {
    const categories = await Category.find();
    await ctx.reply('Categoriyalar:', catalog(categories));
});

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("admin:main"));

scene.on("text", async (ctx) => {
    const category = await Category.findOne({ name: ctx.message.text });
    if (category) {
        ctx.scene.enter("admin:products:list", { category: category.name });
    } else {
        ctx.reply("Categoriya topilmadi!");
    };
});

module.exports = scene;