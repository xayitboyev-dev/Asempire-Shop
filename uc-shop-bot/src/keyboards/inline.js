const { Markup } = require("telegraf");

exports.review = (tariff) => Markup.inlineKeyboard([
    Markup.button.callback("Sotib olish - " + tariff.priceName + " UZS", "buy_" + tariff.count)
]).resize();

exports.payment = (transaction) => Markup.inlineKeyboard([
    Markup.button.url("Payme orqali to'lash", transaction.url),
    Markup.button.callback("To'lovni tekshirish", "check_" + transaction.tid)
]).resize();