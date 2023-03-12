const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('lang');
const { lang } = require("../keyboards/inline");

scene.enter(async (ctx) => {
    await ctx.reply("🇺🇿 Tilni tanlang\n🇷🇺 Выберите язык", lang);
});

scene.action(/^lang_(.+)$/, async (ctx) => {
    ctx.session.lang = ctx.match[1];
    await ctx.deleteMessage();
    await ctx.scene.enter("main");
});

module.exports = scene; 