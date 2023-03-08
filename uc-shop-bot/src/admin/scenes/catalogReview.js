const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:catalog:review');
const { catalogReview } = require('../keyboards/keyboard');
const auth = require("../middlewares/auth");
const Category = require("../../models/Category.js");

scene.enter(auth, async (ctx) => {
    const category = await Category.findById(ctx.scene?.state?.categoryId);
    await ctx.reply(`Kategoriya nomi: ${category.name}`, catalogReview);
});

scene.hears("❌ O'chirish", async (ctx) => {
    await Category.findByIdAndDelete(ctx.scene?.state?.categoryId);
    ctx.reply("❌ Kategoriya muvaffaqqiyatli o'chirildi!");
    ctx.scene.enter("admin:catalog");
});

module.exports = scene;