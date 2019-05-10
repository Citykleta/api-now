"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = db => async (ctx, next) => {
    // @ts-ignore
    const { query } = ctx.query;
    const [last_word, ...others] = query.split(' ').reverse();
    const query_value = [`${last_word}:*`, ...others].join(' & ');
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
