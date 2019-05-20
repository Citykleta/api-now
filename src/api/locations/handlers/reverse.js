"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = db => async (ctx, next) => {
    // @ts-ignore
    const { lng, lat } = ctx.query;
    const { rows } = await db.query(`
SELECT 
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number', house_number, 'street', street_name, 'municipality', municipality_name) as address,
    distance
FROM find_suggestions_closed_to($1, $2) JOIN points_of_interest USING(poi_id)
LIMIT 5
;`, [lng, lat]);
    ctx.body = rows;
};
