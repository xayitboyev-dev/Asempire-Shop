const { Scenes: { Stage } } = require('telegraf');

const stage = new Stage([
    require("../admin/scenes/main"),
    require("../admin/scenes/sendMessage"),
    require("../admin/scenes/catalog"),
    require("../admin/scenes/catalogAdd"),
    require("../admin/scenes/catalogReview"),
    require("../admin/scenes/sendTo"),
    require("../admin/scenes/products"),
    require("../admin/scenes/productsList"),
    require("../admin/scenes/productsAdd"),
    require("../admin/scenes/productsReview"),
    require("./enterPubgId"),
    require("./main"),
    require("./lang"),
    require("./buy"),
]);

module.exports = stage;