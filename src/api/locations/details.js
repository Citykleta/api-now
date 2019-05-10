"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../lib/app");
const body = require("koa-bodyparser");
const koa_json_schema_1 = require("koa-json-schema");
const index_1 = require("../../conf/index");
const pg_1 = require("pg");
const cache_1 = require("../../lib/middlewares/cache");
const details_1 = require("./handlers/details");
const db_pool = new pg_1.Pool(index_1.default.db);
const schema_definition = {
    type: 'object',
    properties: {
        id: {
            type: 'number'
        }
    },
    required: ['id']
};
exports.default = app_1.create_app(app => {
    app.use(body());
    app.use(koa_json_schema_1.middleware(schema_definition, {
        coerceTypes: true
    }));
    app.use(cache_1.default());
    app.use(details_1.handler(db_pool));
});
