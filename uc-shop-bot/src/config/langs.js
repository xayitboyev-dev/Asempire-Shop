module.exports = {
    "welcome": {
        "uz": "⚡️Lux UC Shop - O'zbekistondagi birinchi avtomatlashtirilgan eng arzon, tezkor va sifatli servis!\n\n🤖 @asempire_shop_bot",
        "ru": "⚡️Lux UC Shop - первый автоматизированный дешевый, быстрый и качественный сервис в Узбекистане!\n\n🤖 @asempire_shop_bot"
    },
    "askPubdId": {
        "uz": "Pubg ID raqamingizni kiriting:",
        "ru": "Введите свой идентификатор Pubg:"
    },
    "idErrorMinLength": {
        "uz": "❗️ ID uzunligi eng kamida 6 ta belgidan iborat bo'lishi kerak.",
        "ru": "❗️ Идентификатор должен содержать не менее 6 символов."
    },
    "idErrorMaxLength": {
        "uz": "❗️ ID uzunligi eng ko'pida 20 ta belgidan iborat bo'lishi kerak.",
        "ru": "❗️ Идентификатор должен содержать не более 20 символов."
    },
    "idErrorInvalid": {
        "uz": "❗️ ID ni to'g'ri kiriting!",
        "ru": "❗️ Введите свой ID правильно!"
    },
    "enterTariff": {
        "uz": "Tarifflardan birini tanlang:",
        "ru": "Выберите один из тарифов:"
    },
    "back": {
        "uz": "◀️ Ortga qaytish",
        "ru": "◀️ Назад"
    },
    "tariffReview": {
        "uz": (tariff, pubgId) => `Tarif: ${tariff.name}\nUC soni: ${tariff.count}\nNarxi: ${tariff.priceName} UZS\nPubg id: ${pubgId}`,
        "ru": (tariff, pubgId) => `Тариф: ${tariff.name}\nСколько UC: ${tariff.count}\nЦена: ${tariff.priceName} UZS\nPubg идентификатор: ${pubgId}`,
    },
    "waitingForPay": {
        "uz": (tariff, pubgId, payBy) => `Tarif: ${tariff.name}\nUC soni: ${tariff.count}\nNarxi: ${tariff.priceName} UZS\nPubg id: ${pubgId}\nTo'lov usuli: ${payBy}\n\nTo'lov qilinishi kutilmoqda...`,
        "ru": (tariff, pubgId, payBy) => `Тариф: ${tariff.name}\nСколько UC: ${tariff.count}\nЦена: ${tariff.priceName} UZS\nPubg идентификатор: ${pubgId}\nСпособ оплаты: ${payBy}\n\nОжидается платеж...`,
    },
    "tariffNotFound": {
        "uz": "Bunday tarif mavjud emas!",
        "ru": "Такой тариф не найден!",
    },
    "tariffReviewPay": {
        "uz": (by) => `${by} orqali to'lash`,
        "ru": (by) => `Оплата через ${by}`,
    },
    "successfullyPay": {
        "uz": "✅ Pul to'ladingiz. Tez orada uc tashlab beramiz va xabar beramiz. Hisobingizga UC tushmagan hollarda admin bilan bog'laning.",
        "ru": "✅ Вы оплатили. Мы скоро бросим UC и сообщим вам. Свяжитесь с администратором, если UC не был зачислен на ваш счет."
    },
    "notPaid": {
        "uz": "❗️ To'lov qilinmagan.",
        "ru": "❗️ Не оплачивается."
    },
    "pay": {
        "uz": "To'lash",
        "ru": "Оплатит"
    },
    "check": {
        "uz": "To'lov qildim ✅",
        "ru": "Я заплатил ✅"
    },
    "buyUc": {
        "uz": "💵 UC sotib olish",
        "ru": "💵 Купить UC",
    },
    "changeLang": {
        "uz": "⚙️ Tilni o'zgartirish",
        "ru": "⚙️ Изменить язык",
    },
    "mainMenu": {
        "uz": "🔝 Asosiy menyu",
        "ru": "🔝 Главное меню",
    }
};