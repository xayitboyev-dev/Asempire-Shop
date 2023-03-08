const User = require("../models/User");
const updateUser = require("./updateUser");

module.exports = async (ctx) => {
    try {
        await ctx.scene.enter("main");
        await User.create({ ...ctx.from, uid: ctx.from.id });
        const admins = await User.find({ role: "admin" });
        admins.forEach((admin) => ctx.forwardMessage(admin.uid));
        console.log(ctx.from.id, 'saved');
    } catch (error) {
        if (error.code == 11000) updateUser(ctx.from.id, { ...ctx.from, uid: ctx.from.id });
        else console.log(error);
    };
};