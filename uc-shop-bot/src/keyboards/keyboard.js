const { Markup } = require("telegraf");
const { TARIFF } = require("../config/config.json");
const langs = require("../config/langs");

exports.main = (lang) => Markup.keyboard([
    [langs.buyUc[lang]],
    [langs.changeLang[lang]],
]);

exports.remove = Markup.removeKeyboard();

exports.buy = (lang) => {
    let extra = TARIFF.map((item) => [item.name]);
    extra.push([langs.back[lang]]);
    return Markup.keyboard(extra).resize();
};

exports.idHistory = (ids) => {
    let extra = ids.map((item) => [item.toString()]);
    return Markup.keyboard(extra).resize();
};

exports.cancel = Markup.keyboard([
    ["🔝 Asosiy menyu"]
]).resize();