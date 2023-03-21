const { Markup } = require("telegraf");
const { TARIFF } = require("../config/config.json");
const langs = require("../config/langs");

exports.main = (categories, lang) => {
    const extra = categories.map((item) => [item.name]);
    extra.unshift([langs.buyUc[lang]]);
    // extra.push([langs.changeLang[lang]]);
    return Markup.keyboard(extra).resize();
}

exports.remove = Markup.removeKeyboard();

exports.buy = (lang) => {
    let extra = TARIFF.map((item) => [item.name]);
    extra.push([langs.back[lang]]);
    return Markup.keyboard(extra).resize();
};

exports.idHistory = (ids, lang) => {
    let extra = ids.map((item) => [item.toString()]);
    extra.push([langs.back[lang]]);
    return Markup.keyboard(extra).resize();
};

exports.cancel = Markup.keyboard([
    ["🔝 Asosiy menyu"]
]).resize();