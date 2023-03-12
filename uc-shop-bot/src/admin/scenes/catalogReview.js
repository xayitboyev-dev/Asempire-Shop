const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:catalog:review');
const { catalogReview } = require('../keyboards/keyboard');
const auth = require("../middlewares/auth");
const Category = require("../../models/Category.js");
const Product = require("../../models/Product");

scene.enter(auth, async (ctx) => {
    const category = await Category.findById(ctx.scene?.state?.categoryId);
    const products = await Product.find({ category: category.name });
    await ctx.reply(`Kategoriya nomi: ${category.name}\nProductlari: ${products.length}`, catalogReview);
});

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("admin:catalog"));

scene.hears("❌ O'chirish", async (ctx) => {
    await Category.findByIdAndDelete(ctx.scene?.state?.categoryId);
    ctx.reply("❌ Kategoriya muvaffaqqiyatli o'chirildi!");
    ctx.scene.enter("admin:catalog");
});

module.exports = scene;