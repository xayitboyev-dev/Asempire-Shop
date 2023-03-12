const { Markup } = require('telegraf');

exports.main = Markup.keyboard([
    ["🗂 Catalog", "🛍 Products"],
    ["📤 Xabar tarqatish", "📊 Statistika"],
    ["👤 Userga xabar"]
]).resize();

exports.catalog = (categories, catalog) => {
    let extra = categories.map((item) => [item.name]);
    if (catalog) extra.push(["➕ Qo'shish", "◀️ Orqaga"]);
    else extra.push(["◀️ Orqaga"]);
    return Markup.keyboard(extra).resize();
};

exports.catalogReview = Markup.keyboard([
    ["❌ O'chirish", "◀️ Orqaga"]
]).resize();

exports.cancel = Markup.keyboard([
    ["◀️ Orqaga"]
]).resize();

exports.remove = Markup.removeKeyboard();