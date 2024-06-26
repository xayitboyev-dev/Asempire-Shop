const { PAYME_API, CARDS } = require("../config/config.json");
const axios = require("axios");

module.exports = async function (price) {
    return new Promise((resolve, reject) => {
        try {
            const allCards = CARDS.concat();
            const card = () => allCards[Math.floor(Math.random() * allCards.length)];
            async function pay() {
                const card_id = card();
                if (!card_id) return reject({ err_message: "Bu kun uchun limitga yetdi!" });
                const index = allCards.indexOf(card_id);
                if (index > -1) {
                    allCards.splice(index, 1);
                };
                console.log("Requesting to pay...");
                const response = await axios.post(PAYME_API, {
                    method: "p2p.create",
                    params: {
                        card_id,
                        amount: price,
                        description: "UC sotib olish uchun to'lov qiling!"
                    }
                });
                if (response?.data?.error?.reason == "p2p_daily_transaction_limit") pay();
                else resolve(response.data?.result?.cheque?._id);
            };
            pay();
        } catch (error) {
            reject(error);
        };
    });
};