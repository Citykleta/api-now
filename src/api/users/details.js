"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../lib/app");
const endpoint = async (ctx, next) => {
    ctx.body = {
        name: 'details',
        query: ctx.query
    };
    await next();
};
exports.default = app_1.create_app(app => {
    // app.use(schema({
    //     user: {
    //         type: 'number'
    //     },
    //     required: ['user']
    // }));
    app.use(endpoint);
});
