const { Markup } = require("telegraf");
const langs = require("../config/langs");

exports.review = (tariff, lang) => Markup.inlineKeyboard([
    [Markup.button.callback(langs.tariffReviewPay[lang]("PAYME"), "buyByPayme_" + tariff.count)],
    [Markup.button.callback(langs.tariffReviewPay[lang]("UZUMBANK"), "buyByUzum_" + tariff.count)]
]).resize();

exports.payment = (transaction, lang) => {
    return Markup.inlineKeyboard([
        Markup.button.url(langs.pay[lang], transaction.url),
        Markup.button.callback(langs.check[lang], "check_" + transaction.uuid)
    ]).resize();
};

exports.lang = Markup.inlineKeyboard([
    Markup.button.callback("UZBEK", "lang_uz"), Markup.button.callback("RUSSIAN", "lang_ru")
]);