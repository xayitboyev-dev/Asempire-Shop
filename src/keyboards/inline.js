const { Markup } = require("telegraf");

exports.review = (tariff) => Markup.inlineKeyboard([
    Markup.button.callback("Sotib olish - " + tariff.priceName, "buy_" + tariff.count)
]).resize();

exports.buy = (transaction) => Markup.inlineKeyboard([
    Markup.button.url("Payme orqali to'lash", transaction.url),
    Markup.button.callback("To'lovni tekshirish", "check_" + transaction.tid)
]).resize();