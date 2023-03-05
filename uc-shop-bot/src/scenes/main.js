const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const { idHistory, remove } = require("../keyboards/keyboard");
const { Input } = require("telegraf");
const path = require("path");
const fs = require("fs");

scene.enter(async (ctx) => {
    fs.readFile(path.join(__dirname, "..", "..", "..", "test2.json"), "utf-8", async (err, data) => {
        let history = [];
        try {
            if (err) {
                console.log(err);
            } else {
                const ids = JSON.parse(data);
                const idsFiltered = ids.filter((item) => item.id == ctx.from.id);
                history = idsFiltered.map((item) => item.pubgId + " - " + item.nick);
            };
        } catch (error) {
            console.log(error);
        };
        await ctx.replyWithPhoto(Input.fromLocalFile(path.join(__dirname, "..", "assets", "logo.png"), "logo"), { caption: "⚡️Lux UC Shop - 🇺🇿 O'zbekistondagi birinchi avtomatlashtirilgan eng arzon, tezkor va sifatli servis!\n\n🤖 @LuxUcShopBot" });
        await ctx.reply(`Pubg ID raqamingizni kiriting.`, history.length ? idHistory(history.reverse()) : remove);
    });
});

scene.on("text", async (ctx) => {
    try {
        const id = parseInt(ctx.message.text);

        if (id) {
            if (id.toString().length > 20) return await ctx.reply("❗️ ID uzunligi eng ko'pida 20 ta belgidan iborat bo'lishi kerak.");
            if (id.toString().length < 6) return await ctx.reply("❗️ ID uzunligi eng kamida 6 ta belgidan iborat bo'lishi kerak.");
            ctx.session.pubgId = id;
            await ctx.scene.enter("buy");
        } else {
            await ctx.reply("❗️ ID ni to'g'ri kiriting!");
        };
    } catch (error) {
        console.log(error);
    };
});

module.exports = scene; 