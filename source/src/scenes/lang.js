const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('lang');
const { lang } = require("../keyboards/inline");

scene.enter(async (ctx) => {
    try {
        await ctx.reply("🇺🇿 Tilni tanlang\n🇷🇺 Выберите язык", lang);
    } catch (error) {
        console.log(error);
    }
});

scene.action(/^lang_(.+)$/, async (ctx) => {
    try {
        ctx.session.lang = ctx.match[1];
        await ctx.deleteMessage();
        ctx.scene.enter("main");
    } catch (error) {
        console.log(error);
    };
});

module.exports = scene; 