const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const { main, remove } = require("../keyboards/keyboard");

scene.enter(async (ctx) => {
    try {
        await ctx.replyWithHTML(`Hohlagancha uc sotib olishingiz mumkin. Ishonchi va xavfsiz!`);
        await ctx.reply(`Pubg ID raqamingizni kiriting.`, remove);
    } catch (error) {
        console.log(error);
    };
});

scene.on("text", (ctx) => {
    const id = parseInt(ctx.message.text);

    if (id) {
        ctx.session.pubgId = id;
        ctx.scene.enter("buy");
    } else {
        ctx.reply("ID ni to'g'ri kiriting!");
    };
});

module.exports = scene; 