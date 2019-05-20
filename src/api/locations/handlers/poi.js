"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = db => async (ctx, next) => {
    // @ts-ignore
    const { search } = ctx.query;
    const [last_word, ...others] = search
        .split(' ')
        .reverse();
    const query_value = [`${last_word}:*`, ...others].join(' & ');
    const { rows } = await db.query(`
SELECT 
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number', house_number, 'street', street_name, 'municipality', municipality_name) as address,
    description
FROM find_suggestions($1) 
JOIN points_of_interest USING(poi_id)
LIMIT 5
;`, [query_value]);
    ctx.body = rows;
};
