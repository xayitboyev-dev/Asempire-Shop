const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('result');
const translate = require('translate-google');
const { cancel } = require("../keyboards/keyboard");
const bot = require("../core/bot");
const start = require("../utils/start");

scene.enter(async (ctx) => {
    try {
        await ctx.reply("Yaxshi, endi matinni yuboring", cancel);
    } catch (error) {
        console.log(error);
    };
});

scene.hears("🔝 Asosiy menyu", async (ctx) => {
    try {
        await ctx.scene.enter("main");
    } catch (error) {
        console.log(error);
    };
});

scene.start(start);

scene.on("text", async (ctx) => {
    try {
        const msg = await ctx.reply("Loading...");
        const result = await translate(ctx.message.text, { from: ctx.scene.state.from.data, to: ctx.scene.state.to.data });
        await bot.telegram.editMessageText(msg.chat.id, msg.message_id, null, result);
    } catch (error) {
        if (error.code === 400) {
            await ctx.reply("Kechirasiz, bu tilga tarjima qila olmayman 😔");
            await ctx.scene.enter("main");
        };
    };
});

module.exports = scene;