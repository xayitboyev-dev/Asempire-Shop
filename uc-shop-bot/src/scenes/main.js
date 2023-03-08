const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const { Input } = require("telegraf");
const path = require("path");
const langs = require("../config/langs");
const { main } = require("../keyboards/keyboard");

scene.enter(async (ctx) => {
    await ctx.replyWithPhoto(Input.fromLocalFile(path.join(__dirname, "..", "assets", "logo.png"), "logo"), { caption: langs.welcome[ctx.session.lang] });
    await ctx.reply("Shopping", main(ctx.session.lang));
});

scene.hears(Object.values(langs.buyUc), (ctx) => ctx.scene.enter("enterPubgId"));

scene.hears(Object.values(langs.changeLang), (ctx) => ctx.scene.enter("lang"));

module.exports = scene; 