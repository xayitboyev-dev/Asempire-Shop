const { Markup } = require("telegraf");
const langs = require("../config/langs");

exports.review = (count, lang) => [
    [Markup.button.callback(langs.tariffReviewPay[lang]("PAYME"), "buyByPayme_" + count)],
    [Markup.button.callback(langs.tariffReviewPay[lang]("UZUMBANK"), "buyByUzum_" + count)]
]

exports.productPaymentType = (price, lang) => Markup.inlineKeyboard([
    [Markup.button.callback(langs.tariffReviewPay[lang]("PAYME"), "buyByPayme_" + price)],
    [Markup.button.callback(langs.tariffReviewPay[lang]("UZUMBANK"), "buyByUzum_" + price)]
]).resize();

exports.payment = (transaction, lang) => {
    return Markup.inlineKeyboard([
        Markup.button.url(langs.pay[lang], transaction.url),
        Markup.button.callback(langs.check[lang], "check_" + transaction.uuid)
    ]).resize();
};

exports.lang = Markup.inlineKeyboard([
    Markup.button.callback("🇺🇿 UZBEK", "lang_uz"), Markup.button.callback("🇷🇺 RUSSIAN", "lang_ru")
]);