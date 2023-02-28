const { Markup } = require("telegraf");
const { TARIFF } = require("../config/config.json");

exports.main = Markup.keyboard([
    ["UC sotib olish"]
]);

exports.remove = Markup.removeKeyboard();

exports.buy = () => {
    let extra = [];
    let row = [];
    let count = 0;

    TARIFF.forEach((item, idx) => {
        row.push(item.name);
        if (count >= 1 || idx === TARIFF.length - 1) {
            extra.push(row);
            row = [];
            count = 0;
            return;
        };
        count++;
    });

    extra.push(["◀️ Ortga qaytish"])

    return Markup.keyboard(extra).resize();
};

exports.cancel = Markup.keyboard([
    ["🔝 Asosiy menyu"]
]).resize();