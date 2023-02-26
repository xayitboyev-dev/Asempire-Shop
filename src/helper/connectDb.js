const mongoose = require("mongoose");
const { MONGO_DB } = require("../config/config.json");

mongoose.set("strictQuery", false);

module.exports = () => mongoose.connect(MONGO_DB);