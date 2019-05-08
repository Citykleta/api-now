"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../utils/app");
const body = require("koa-bodyparser");
const koa_json_schema_1 = require("koa-json-schema");
const index_1 = require("../../conf/index");
const pg_1 = require("pg");
const cache_1 = require("../../utils/middlewares/cache");
const db_pool = new pg_1.Pool(index_1.default.db);
const endpoint = db => async (ctx, next) => {
    const { id } = ctx.params;
    const { rows } = await db.query(`
SELECT
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    description,
    json_build_object('number',"addr:number",'street',"addr:street", 'municipality', "addr:municipality") as address
FROM points_of_interest
WHERE poi_id = $1
`, [id]);
    if (!rows.length) {
        ctx.throw(404);
    }
    ctx.body = rows[0];
};
exports.default = app_1.create_app(app => {
    app.use(body());
    const schema_definition = {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            }
        },
        required: ['id']
    };
    app.use(koa_json_schema_1.middleware(schema_definition, {
        coerceTypes: true
    }));
    app.use(cache_1.default());
    app.use(endpoint(db_pool));
});
