export default (name = 'handler') => async (ctx, next) => {
    const now = Date.now();
    await next();
    ctx.set('Server-Timing', `${name};dur=${Date.now() - now}`);
};
