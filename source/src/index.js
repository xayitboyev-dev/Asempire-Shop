const bot = require("./core/bot");
const connectDb = require("./helper/connectDb");
const stage = require("./scenes/index");
const langMiddleware = require("./middlewares/langMiddleware");

bot.use(stage.middleware());
bot.use(langMiddleware);
require("./admin/index");
bot.command("language", (ctx) => ctx.scene.enter("lang"));
bot.on("message", (ctx) => ctx.scene.enter("main"));
bot.use((ctx) => ctx.scene.enter("main"));

async function startBot() {
    try {
        await connectDb();
        console.log("Connected to database");
        bot.launch();
        console.log("Bot started");
    } catch (error) {
        console.log(error);
        process.exit(0);
    };
};

startBot();