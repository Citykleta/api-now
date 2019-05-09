"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../utils/app");
const koa_json_schema_1 = require("koa-json-schema");
const index_1 = require("../../conf/index");
const pg_1 = require("pg");
const cache_1 = require("../../utils/middlewares/cache");
const db_pool = new pg_1.Pool(index_1.default.db);
const endpoint = db => async (ctx, next) => {
    // @ts-ignore
    const { query } = ctx.query;
    const query_value = `${query.split(' ')
        .map(v => `${v}:*`)
        .join(' & ')}`;
    console.log(query_value);
    const { rows } = await db.query(`
SELECT 
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number',"addr:number",'street',"addr:street", 'municipality', "addr:municipality") as address,
    description
FROM find_suggestions('${query_value}') 
JOIN points_of_interest USING(poi_id);`);
    ctx.body = rows;
};
const schema_definition = {
    type: 'object',
    properties: {
        query: {
            type: 'string'
        }
    },
    required: ['query']
};
exports.default = app_1.create_app(app => {
    app.use(koa_json_schema_1.middleware(schema_definition));
    app.use(cache_1.default());
    app.use(endpoint(db_pool));
});
