const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const { Input } = require("telegraf");
const path = require("path");
const langs = require("../config/langs");
const { main } = require("../keyboards/keyboard");
const Category = require("../models/Category");

scene.enter(async (ctx) => {
    const categories = await Category.find();
    await ctx.replyWithPhoto(Input.fromLocalFile(path.join(__dirname, "..", "assets", "logo.png"), "logo"), { caption: langs.welcome[ctx.session.lang] });
    await ctx.reply(langs.mainMenu[ctx.session.lang], main(categories, ctx.session.lang));
});

scene.hears(Object.values(langs.buyUc), (ctx) => ctx.scene.enter("enterPubgId"));

// scene.hears(Object.values(langs.changeLang), (ctx) => ctx.scene.enter("lang"));

module.exports = scene; 