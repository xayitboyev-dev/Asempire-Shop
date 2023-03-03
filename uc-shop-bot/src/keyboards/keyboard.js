const { Markup } = require("telegraf");
const { TARIFF } = require("../config/config.json");

exports.main = Markup.keyboard([
    ["UC sotib olish"]
]);

exports.remove = Markup.removeKeyboard();

exports.buy = () => {
    let extra = TARIFF.map((item) => [item.name]);
    extra.push(["◀️ Ortga qaytish"]);
    return Markup.keyboard(extra).resize();
};

exports.idHistory = (ids) => {
    let extra = ids.map((item) => [item.toString()]);
    return Markup.keyboard(extra).resize();
};

exports.cancel = Markup.keyboard([
    ["🔝 Asosiy menyu"]
]).resize();