"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => async (ctx, next) => {
    ctx.status = 200;
    try {
        await next();
    }
    catch (e) {
        if (process.env.NODE_ENV !== 'test') {
            console.error(e);
        }
        ctx.status = e.status || 500;
    }
};
