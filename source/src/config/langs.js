const getStringPrice = require("../utils/getStringPrice");

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
        "uz": "◀️ Orqaga",
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
    "productView": {
        "uz": (product) => `Nomi: ${product.name}\nNarxi: ${getStringPrice(product.price)}\nKategoriyasi: ${product.category}`,
        "ru": (product) => `Имя: ${product.name}\nЦена: ${getStringPrice(product.price)}\nКатегория: ${product.category}`
    },
    "productViewWaiting": {
        "uz": (product, payBy) => `Nomi: ${product.name}\nNarxi: ${getStringPrice(product.price)}\nKategoriyasi: ${product.category}\nTo'lov usuli: ${payBy}\n\nTo'lov qilinishi kutilmoqda...`,
        "ru": (product, payBy) => `Имя: ${product.name}\nЦена: ${getStringPrice(product.price)}\nКатегория: ${product.category}\nСпособ оплаты: ${payBy}\n\nОжидается платеж...`
    },
    "productPaid": {
        "uz": (product, transaction, details, time) => `Nomi: ${product.name}\nNarxi: ${getStringPrice(product.price)}\nKategoriyasi: ${product.category}\n\n<b>Mahsulotdan foydalanish uchun kerakli ma'lumotlar:\n\n${details}</b>\n\n----------------------\n<code>To'landi. Chek:\n\nTo'lov usuli: ${transaction.payBy}\nTo'lov narxi: ${getStringPrice(transaction.price)}\nTo'lov sanasi: ${time}</code>`,
        "ru": (product, transaction, details, time) => `Имя: ${product.name}\nЦена: ${getStringPrice(product.price)}\nКатегория: ${product.category}\n\n<b>Информация, необходимая для использования продукта:\n\n${details}</b>\n\n----------------------\n<code>Оплаченный. Чек:\n\nСпособ оплаты: ${transaction.payBy}\nЦена платежа: ${getStringPrice(transaction.price)}\nДата оплаты: ${time}</code>`,
    },
    "tariffNotFound": {
        "uz": "Bunday tarif mavjud emas!",
        "ru": "Такой тариф не найден!",
    },
    "tariffReviewPay": {
        "uz": (by) => `${by} orqali to'lash`,
        "ru": (by) => `Оплата через ${by}`,
    },
    "products": {
        "uz": "Mahsulotlar:",
        "ru": "Продукты:"
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