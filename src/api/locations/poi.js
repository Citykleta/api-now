"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../lib/app");
const koa_json_schema_1 = require("koa-json-schema");
const index_1 = require("../../conf/index");
const pg_1 = require("pg");
const cache_1 = require("../../lib/middlewares/cache");
const server_timing_1 = require("../../lib/middlewares/server-timing");
const poi_1 = require("./handlers/poi");
const db_pool = new pg_1.Pool(index_1.default.db);
const schema_definition = {
    type: 'object',
    properties: {
        search: {
            type: 'string'
        }
    },
    required: ['search']
};
exports.default = app_1.create_app(app => {
    app.use(koa_json_schema_1.middleware(schema_definition));
    app.use(cache_1.default());
    app.use(server_timing_1.default());
    app.use(poi_1.handler(db_pool));
});
