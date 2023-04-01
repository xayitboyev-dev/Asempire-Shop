const { Scenes: { WizardScene } } = require("telegraf");
const { cancel } = require('../keyboards/keyboard');
const Product = require("../../models/Product");
const path = require("path");

const scene = new WizardScene('admin:products:add',
    async (ctx) => {
        await ctx.reply("Productning nomini kiriting:", cancel);
        ctx.wizard.next();
    },
    async (ctx) => {
        ctx.scene.state.name = ctx.message?.text;
        await ctx.reply("Productning narxini kiriting (namuna: 1000)");
        ctx.wizard.next();
    },
    async (ctx) => {
        const price = parseInt(ctx.message.text + "00");
        if (price) {
            if (price && price >= 100000) {
                ctx.scene.state.price = price;
                await ctx.reply("Rasm yuboring!");
                ctx.wizard.next();
            } else {
                await ctx.reply("Eng kamida 1000 bo'lishi zarur!");
            };
        } else {
            await ctx.reply("Faqat sonlarda kiriting!");
        };
    },
    async (ctx) => {
        if (ctx.message.photo) {
            ctx.scene.state.image_link = await ctx.telegram.getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id);
            await ctx.reply("Malumotlarini namuna bo'yicha kiriting!\n\nnamuna\n\nkey: value\nusername: john123\npassword: 21123");
            ctx.wizard.next();
        } else {
            await ctx.reply("Faqat rasm yuborishingiz mumkin!");
        };
    },
    async (ctx) => {
        const details = [];
        const cols = ctx.message.text.split("\n");
        let error = false;
        cols.forEach((item) => {
            const idx = item.indexOf(":");
            const key = item.substring(0, idx);
            const value = item.substring(idx + 2);
            if ((idx < 0) || key == "" || value == "") error = true;
            details.push({ key, value });
        });
        if (error) {
            await ctx.reply("Iltimos yaroqli malumot kiriting!");
        } else {
            ctx.scene.state.details = details;
            try {
                await Product.create(ctx.scene.state);
                await ctx.reply("✅ Product qo'shildi");
                ctx.scene.enter("admin:products");
            } catch (error) {
                console.log(error);
            };
        };
    }
);

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("admin:main"));

module.exports = scene;