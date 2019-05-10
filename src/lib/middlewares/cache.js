"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (maxAge = 7 * 3600 * 24) => async (ctx, next) => {
    await next();
    ctx.set('Cache-Control', `public, max-age=${maxAge}`);
};
