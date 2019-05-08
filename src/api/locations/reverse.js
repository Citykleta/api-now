"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../utils/app");
const koa_json_schema_1 = require("koa-json-schema");
const conf_1 = require("../../conf");
const pg_1 = require("pg");
const cache_1 = require("../../utils/middlewares/cache");
const db_pool = new pg_1.Pool(conf_1.default.db);
const endpoint = db => async (ctx, next) => {
    // @ts-ignore
    const { lng, lat } = ctx.query;
    const { rows } = await db.query(`
SELECT 
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    distance,
    json_build_object('number',"addr:number",'street',"addr:street", 'municipality', "addr:municipality") as address
FROM find_suggestions_closed_to(${lng},${lat}) JOIN points_of_interest USING(poi_id);`);
    ctx.body = rows;
};
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
    app.use(endpoint(db_pool));
});
