const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('enterPubgId');
const { idHistory, remove } = require("../keyboards/keyboard");
const start = require("../utils/start");
const langs = require("../config/langs");
const fs = require("fs");
const path = require("path");
const { Input } = require("telegraf");

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
        try {
            await ctx.replyWithPhoto(Input.fromLocalFile(path.join(__dirname, "..", "assets", "logo.png"), "uc_logo"), { caption: langs.welcome[ctx.session.lang] });
            await ctx.reply(langs.askPubdId[ctx.session.lang], history.length ? idHistory(history.reverse(), ctx.session.lang) : remove);
        } catch (error) {
            console.log(error);
        }
    });
});

scene.start(start);

scene.hears(Object.values(langs.back), (ctx) => ctx.scene.enter("main"));

scene.on("text", async (ctx) => {
    try {
        const id = parseInt(ctx.message.text);
        if (id) {
            if (id.toString().length > 20) return await ctx.reply(langs.idErrorMaxLength[ctx.session.lang]);
            if (id.toString().length < 6) return await ctx.reply(langs.idErrorMinLength[ctx.session.lang]);
            ctx.session.pubgId = id;
            await ctx.scene.enter("buy", { tariff: ctx.scene?.state?.tariff });
        } else {
            await ctx.reply(langs.idErrorInvalid[ctx.session.lang]);
        };
    } catch (error) {
        console.log(error);
    };
});

module.exports = scene; 