const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');

scene.enter((ctx) => {
    ctx.reply("ENTER || LANG");
});

scene.hears("ENTER", (ctx) => ctx.scene.enter("enterPubgId"));

scene.hears("LANG", (ctx) => ctx.scene.enter("lang"));

module.exports = scene; 