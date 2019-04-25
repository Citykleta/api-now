"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../utils/app");
const endpoint = async (ctx, next) => {
    ctx.body = {
        name: 'details',
        query: ctx.query
    };
    await next();
};
exports.default = app_1.createApp(app => {
    // app.use(schema({
    //     user: {
    //         type: 'number'
    //     },
    //     required: ['user']
    // }));
    app.use(endpoint);
});
