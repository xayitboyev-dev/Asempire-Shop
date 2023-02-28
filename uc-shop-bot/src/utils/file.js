const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "..", "..", "test.json");
const bot = require("../core/bot");

setInterval(() => {
    fs.readFile(filePath, "utf-8", (err, data) => {
        try {
            if (err) {
                console.log(err);
            } else {
                const parsedData = JSON.parse(data.toString());
                parsedData.forEach((item, index) => {
                    if (item.status == "done") {
                        console.log(item.id, "is done");
                        bot.telegram.sendMessage(item.chatId, `✅ ${item.pubgId} id raqamli pubg hisobingizga ${item.count} UC tashlab berildi.`);
                        parsedData.splice(index, 1);
                        fs.writeFile(filePath, JSON.stringify(parsedData), "utf-8", (err) => {
                            if (err) console.log(err);
                        });
                    } else if (item.status == "error") {
                        console.log(item.id, "is error");
                        bot.telegram.sendMessage(item.chatId, `❌ Siz kiritgan ${item.pubgId} id raqamli pubg hisobingizga ${item.count} UC o'tkazilmadi. Adminlar bilan bog'lanib pulingizni qaytib olishingiz mumkin!`);
                        parsedData.splice(index, 1);
                        fs.writeFile(filePath, JSON.stringify(parsedData), "utf-8", (err) => {
                            if (err) console.log(err);
                        });
                    };
                });
            };
        } catch (error) {
            console.log(error);
        };
    });
}, 1000);

module.exports.addTask = function (task) {
    try {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.errno == -4058) {
                    const strArr = JSON.stringify([task]);
                    fs.writeFile(filePath, strArr, "utf-8", (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Successfully added");
                        };
                    });
                }
            } else {
                const oldData = JSON.parse(data.toString());
                oldData.push(task);
                const newData = JSON.stringify(oldData);
                fs.writeFile(filePath, newData, "utf-8", (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully added");
                    };
                });
            };
        });
    } catch (error) {
        console.log(error);
    };
};