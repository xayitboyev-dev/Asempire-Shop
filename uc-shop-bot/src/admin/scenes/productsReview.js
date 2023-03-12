const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:products:review');
const { catalogReview } = require('../keyboards/keyboard');
const Product = require("../../models/Product.js");

scene.enter(async (ctx) => {
    const { product } = ctx.scene.state;
    const mapped = product.details.map((item) => item.key + ": " + item.value);
    const joined = mapped.join("\n");
    await ctx.reply(`Nomi: ${product.name}\nNarxi: ${product.price}\nKategoriyasi: ${product.category}\n\nMa'lumotlari\n` + joined, catalogReview);
});

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("admin:main"));

scene.hears("❌ O'chirish", async (ctx) => {
    await Product.findByIdAndDelete(ctx.scene?.state?.product.id);
    ctx.reply("❌ Product muvaffaqqiyatli o'chirildi!");
    ctx.scene.enter("admin:main");
});

module.exports = scene;