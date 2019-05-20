"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = db => async (ctx, next) => {
    const { id } = ctx.params;
    const { rows } = await db.query(`
SELECT
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number', house_number, 'street', street_name, 'municipality', municipality_name) as address,
    description
FROM points_of_interest
WHERE poi_id = $1;
`, [id]);
    if (!rows.length) {
        ctx.throw(404);
    }
    ctx.body = rows[0];
};
