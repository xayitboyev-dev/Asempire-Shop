const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "..", "test.json");
const bot = require("../core/bot");

setInterval(() => {
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedData = JSON.parse(data.toString());
            parsedData.forEach((item, index) => {
                if (item.status == "done") {
                    console.log(item.id, "is done");
                    bot.telegram.sendMessage(item.chatId, `✅ Pubg hisobingizga ${item.count} UC tashlab berildi.`);
                    parsedData.splice(index, 1);
                    fs.writeFile(filePath, JSON.stringify(parsedData), "utf-8", (err) => {
                        if (err) console.log(err);
                    });
                };
            });
        };
    });
}, 1000);

const data = () => { return { id: Math.floor(Math.random() * 999999999), count: 200, status: "waiting" } };

module.exports.addTask = function (task) {
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
};