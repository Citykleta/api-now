"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const logger = require("koa-logger");
const error_1 = require("./middlewares/error");
const cors = require("@koa/cors");
const index_1 = require("../conf/index");
// process.stdout
const defaultTransport = (str, args) => {
    console.log(...args);
};
// do not log
const muteTransport = () => {
};
const applicationLogger = logger(process.env.NODE_ENV === 'test' ? muteTransport : defaultTransport);
exports.createApp = (endpoint) => {
    const app = new Koa();
    app.use(applicationLogger);
    app.use(error_1.default());
    app.use(cors(index_1.default.cors));
    endpoint(app);
    return app.callback();
};
