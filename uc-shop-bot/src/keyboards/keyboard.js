const { Markup } = require("telegraf");
const { TARIFF } = require("../config/config.json");
const langs = require("../config/langs");

exports.main = (lang) => Markup.keyboard([
    [langs.buyUc[lang]],
    [langs.changeLang[lang]],
]).resize();

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