const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const { idHistory } = require("../keyboards/keyboard");
const { Input } = require("telegraf");
const User = require("../models/User");
const path = require("path");

scene.enter(async (ctx) => {
    try {
        const user = await User.findOne({ uid: ctx.from.id });
        await ctx.replyWithPhoto(Input.fromLocalFile(path.join(__dirname, "..", "assets", "logo.png"), "logo"), { caption: "⚡️Lux UC Shop - 🇺🇿 O'zbekistondagi birinchi avtomatlashtirilgan eng arzon, tezkor va sifatli servis!\n\n🤖 @LuxUcShopBot" });
        await ctx.reply(`Pubg ID raqamingizni kiriting.`, idHistory(user.idHistory.reverse()));
    } catch (error) {
        console.log(error);
    };
});

scene.on("text", async (ctx) => {
    try {
        const id = parseInt(ctx.message.text);
        const user = await User.findOne({ uid: ctx.from.id });

        if (id) {
            if (id.toString().length > 20) return await ctx.reply("❗️ ID uzunligi eng ko'pida 20 ta belgidan iborat bo'lishi kerak.");
            if (id.toString().length < 6) return await ctx.reply("❗️ ID uzunligi eng kamida 6 ta belgidan iborat bo'lishi kerak.");
            ctx.session.pubgId = id;
            await ctx.scene.enter("buy");
            if (!user.idHistory.includes(id)) {
                user.idHistory.push(id);
                if (user.idHistory.length > 5) user.idHistory.shift();
                await user.save();
            };
        } else {
            await ctx.reply("❗️ ID ni to'g'ri kiriting!");
        };
    } catch (error) {
        console.log(error);
    };
});

module.exports = scene; 