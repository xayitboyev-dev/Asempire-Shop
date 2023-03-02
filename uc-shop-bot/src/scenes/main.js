const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const { remove } = require("../keyboards/keyboard");
const { Input } = require("telegraf");
const path = require("path");

scene.enter(async (ctx) => {
    try {
        await ctx.replyWithPhoto(Input.fromLocalFile(path.join(__dirname, "..", "assets", "logo.png"), "logo"), { caption: "⚡️Lux UC Shop - 🇺🇿 O'zbekistondagi birinchi avtomatlashtirilgan eng arzon, tezkor va sifatli servis!\n\n🤖 @LuxUcShopBot" });
        await ctx.reply(`Pubg ID raqamingizni kiriting.`, remove);
    } catch (error) {
        console.log(error);
    };
});

scene.on("text", async (ctx) => {
    try {
        const id = parseInt(ctx.message.text);

        if (id) {
            ctx.session.pubgId = id;
            await ctx.scene.enter("buy");
        } else {
            await ctx.reply("ID ni to'g'ri kiriting!");
        };
    } catch (error) {
        console.log(error);
    };
});

module.exports = scene; 