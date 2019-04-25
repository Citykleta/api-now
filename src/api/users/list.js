"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../utils/app");
const endpoint = async (ctx, next) => {
    ctx.response.body = [{
            id: 1,
            name: 'Laurent RENARD'
        }];
    await next();
};
exports.default = app_1.createApp(app => app.use(endpoint));
