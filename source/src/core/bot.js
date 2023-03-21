const { Telegraf, session } = require("telegraf");
const { BOT_TOKEN } = require("../config/config.json");

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.use((ctx, next) => { if (ctx.from?.id && !(["kicked", "left", "restricted"].includes(ctx.myChatMember?.old_chat_member?.status))) next(); });
// bot.telegram.setMyCommands([{ command: "start", description: "Update bot" }, { command: "language", description: "Change language" }]);
bot.catch(async (err) => console.log(err));

module.exports = bot;