const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('to');
const { getLangs } = require("../keyboards/keyboard");
const langs = require("../helper/langs.json");
const start = require("../utils/start");

scene.enter(async (ctx) => {
    try {
        await ctx.reply(ctx.scene.state.from.text + " dan qaysi tilga tarjima qilamiz?", getLangs());
    } catch (error) {
        console.log(error);
    };
});

scene.start(start);

scene.on("text", async (ctx) => {
    try {
        const lang = langs.find((item) => item.text === ctx.message.text);
        if (lang) await ctx.scene.enter("result", { from: ctx.scene.state.from, to: lang })
        else await ctx.reply("❗️ Iltimos quyidagi tugmalardan foydalanib, tilni tanlang", getLangs());
    } catch (error) {
        console.log(error);
    };
});

module.exports = scene;