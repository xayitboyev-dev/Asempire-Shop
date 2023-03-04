const { Markup } = require("telegraf");

exports.review = (tariff) => Markup.inlineKeyboard([
    [Markup.button.callback("Payme orqali to'lash", "buyByPayme_" + tariff.count)],
    [Markup.button.callback("Uzumbank orqali to'lash", "buyByUzum_" + tariff.count)]
]).resize();

exports.payment = (transaction) => {
    console.log(transaction);
    
    return Markup.inlineKeyboard([
        Markup.button.url("To'lash", transaction.url),
        Markup.button.callback("To'lovni tekshirish", "check_" + transaction.uuid)
    ]).resize();
};