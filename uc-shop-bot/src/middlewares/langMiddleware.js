module.exports = (ctx, next) => {
    if (ctx?.session?.lang && ["uz", "ru"].includes(ctx?.session?.lang)) next();
    else ctx.scene.enter("lang");
};