const bot = require('../core/bot');

bot.command("admin", async (ctx) => ctx.scene.enter("admin:main"));