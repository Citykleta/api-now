"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const logger = require("koa-logger");
const error_1 = require("./middlewares/error");
const cors = require("@koa/cors");
const index_1 = require("../conf/index");
// process.stdout
const default_transport = (str, args) => {
    console.log(...args);
};
// do not log
const mute_transport = () => {
};
const application_logger = logger(process.env.NODE_ENV === 'test' ? mute_transport : default_transport);
exports.create_app = (endpoint) => {
    const app = new Koa();
    app.use(application_logger);
    app.use(error_1.default());
    app.use(cors(index_1.default.cors));
    endpoint(app);
    return app.callback();
};
