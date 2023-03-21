const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { UZUMBANK_API } = require("../config/config.json");
const proxy = require("../config/proxy.json");

module.exports = (tid) => new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "..", "config", "uzumConfig.json"), "utf-8", async (err, data) => {
        try {
            if (err) reject();
            else {
                const uzumConfig = JSON.parse(data);
                const response = await axios.get(UZUMBANK_API + tid, { headers: uzumConfig, proxy });
                if (response.data?.data?.expressStatus == "ACTIVE") reject();
            };
        } catch (error) {
            if (["Express state: COMPLETED", "Состояние Express: COMPLETED"].includes(error.response?.data?.errorMessage)) resolve();
            else reject();
        };
    });
});