const { Markup } = require('telegraf');

exports.main = Markup.keyboard([
    ["🗂 Catalog", "🛍 Products"],
    ["📤 Xabar tarqatish", "📊 Statistika"],
    ["👤 Userga xabar"]
]).resize();

exports.catalog = (categories) => {
    let extra = categories.map((item) => [item.name]);
    extra.push(["➕ Qo'shish", "◀️ Orqaga"]);
    return Markup.keyboard(extra).resize();
};

exports.catalogReview = Markup.keyboard([
    ["❌ O'chirish"]
]).resize();

exports.cancel = Markup.keyboard([
    ["◀️ Orqaga"]
]).resize();

exports.remove = Markup.removeKeyboard();