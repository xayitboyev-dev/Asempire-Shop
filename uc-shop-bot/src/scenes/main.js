const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const langs = require("../config/langs");
const { main } = require("../keyboards/keyboard");

scene.enter((ctx) => {
    ctx.reply("Shopping", main(ctx.session.lang));
});

scene.hears(Object.values(langs.buyUc), (ctx) => ctx.scene.enter("enterPubgId"));

scene.hears(Object.values(langs.changeLang), (ctx) => ctx.scene.enter("lang"));

module.exports = scene; 