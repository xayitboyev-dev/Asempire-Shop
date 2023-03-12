const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:products:list');
const { catalog } = require('../keyboards/keyboard');
const auth = require("../middlewares/auth");
const Product = require("../../models/Product");

scene.enter(auth, async (ctx) => {
    const products = await Product.find({ category: ctx.scene.state.category });
    await ctx.reply('Products:', catalog(products, true));
});

scene.hears("➕ Qo'shish", (ctx) => ctx.scene.enter("admin:products:add", { category: ctx.scene.state.category }));

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("admin:main"));

scene.on("text", async (ctx) => {
    const product = await Product.findOne({ name: ctx.message.text });
    if (product) {
        ctx.scene.enter("admin:products:review", { product });
    } else {
        ctx.reply("Product topilmadi!");
    };
});

module.exports = scene;