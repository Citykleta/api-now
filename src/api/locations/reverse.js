"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../lib/app");
const koa_json_schema_1 = require("koa-json-schema");
const conf_1 = require("../../conf");
const pg_1 = require("pg");
const cache_1 = require("../../lib/middlewares/cache");
const server_timing_1 = require("../../lib/middlewares/server-timing");
const reverse_1 = require("./handlers/reverse");
const db_pool = new pg_1.Pool(conf_1.default.db);
const schema_definition = {
    type: 'object',
    properties: {
        lng: {
            type: 'number'
        },
        lat: {
            type: 'number'
        }
    },
    required: ['lng', 'lat']
};
exports.default = app_1.create_app(app => {
    app.use(koa_json_schema_1.middleware(schema_definition, { coerceTypes: true }));
    app.use(cache_1.default());
    app.use(server_timing_1.default());
    app.use(reverse_1.handler(db_pool));
});
