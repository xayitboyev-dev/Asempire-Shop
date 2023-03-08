const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:catalog:add');
const { catalog, remove, cancel } = require('../keyboards/keyboard');
const auth = require("../middlewares/auth");
const Category = require("../../models/Category.js");

scene.enter(auth, async (ctx) => {
    await ctx.reply('Categoriyaga nom kiriting:', cancel);
});

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("admin:main:catalog"));

scene.on("text", async (ctx) => {
    await Category.create({ name: ctx.message.text });
    ctx.reply("✅ Kategoriya qo'shildi");
    ctx.scene.enter("admin:catalog");
});

scene.use(async (ctx) => {
    await ctx.reply("Kategoriyaga to'gri nom bering, faqat yozuvlarda iborat bo'lsin!");
});

module.exports = scene;