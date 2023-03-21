const { Markup } = require('telegraf');
const langs = require('../../config/langs');

exports.main = Markup.keyboard([
    ["🗂 Catalog", "🛍 Products"],
    ["📤 Xabar tarqatish", "📊 Statistika"],
    ["👤 Userga xabar"]
]).resize();

exports.catalog = (categories, catalog, lang) => {
    let extra = categories.map((item) => [item.name]);
    if (catalog) extra.push(["➕ Qo'shish", langs.back[lang]]);
    else extra.push([langs.back[lang]]);
    return Markup.keyboard(extra).resize();
};

exports.catalogReview = Markup.keyboard([
    ["❌ O'chirish", "◀️ Orqaga"]
]).resize();

exports.cancel = Markup.keyboard([
    ["◀️ Orqaga"]
]).resize();

exports.remove = Markup.removeKeyboard();