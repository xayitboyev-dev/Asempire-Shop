const { UZUMBANK_API } = require("../config/config.json");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const proxy = require("../config/proxy.json");

module.exports = (price) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "..", "config", "uzumConfig.json"), "utf-8", async (err, data) => {
            if (err) {
                reject("Transaction error");
            } else {
                try {
                    const uzumConfig = JSON.parse(data);
                    const respone = await axios.post(UZUMBANK_API, {
                        "accountType": "UZCARD",
                        "count": "1",
                        "currency": {
                            "name": "UZS",
                            "scale": 2
                        },
                        "expressAmount": price,
                        "fixedAmount": price,
                        "ownerName": "NAQIBOV XOLXUJA",
                        "reserveSms": false,
                        "subjectId": 3942603,
                        "title": "pubg 60 uc | @LuxUcShopBot",
                        "totalAmount": price,
                        "type": "RECEIVER"
                    }, { headers: uzumConfig, proxy });
                    if (respone?.data?.errorMessage?.length) throw respone?.data?.errorMessage;
                    else {
                        const payUrl = respone.data?.data?.expressUrl;
                        if (payUrl) resolve(payUrl.substring(payUrl.indexOf("code=") + 5));
                        else throw "Err";
                    };
                } catch (error) {
                    console.log(error);
                    reject("Transaction error");
                };
            }
        });
    });
};