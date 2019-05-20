"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_address_1 = require("../../lib/normalize_address");
const find_streets_factory = (fn_call) => `
SELECT DISTINCT ON(streets.geometry)
    'street' as type,
    name,
    json_build_object('type', 'LineString', 'coordinates', ST_AsEncodedPolyline(geometry, 5))::json as geometry,
    municipality
FROM ${fn_call}
JOIN streets USING (street_id);
`;
const find_intersection_factory = (fn_call_1, fn_call_2) => `
SELECT DISTINCT ON (geometry)
    'corner' as type,
    ST_AsGeoJSON(ST_Intersection(s1.geometry, s2.geometry))::json as geometry,
    ARRAY[ s1.name, s2.name] as streets,
    s1.municipality as municipality
FROM
    (SELECT 
        name, 
        municipality, 
        geometry, 
        street_id 
    FROM ${fn_call_1} 
    JOIN streets USING(street_id)) as s1,
    (SELECT 
        name, 
        municipality, 
        geometry, 
        street_id 
    FROM ${fn_call_2}
    JOIN streets using(street_id)) as s2
WHERE ST_Intersects(s1.geometry, s2.geometry);
`;
const find_street_in_between_factory = (fn_call_1, fn_call_2, fn_call_3) => `

SELECT DISTINCT ON (st.geometry)
    'street_block' as type,
    st.name as name,
    st.municipality as municipality,
    json_build_object('type', 'LineString', 'coordinates', ST_AsEncodedPolyline(st.geometry, 5))::json as geometry,
    ARRAY[
        json_build_object('geometry',ST_AsGeoJSON(ST_Intersection(st.geometry, int_1.geometry))::json, 'name', int_1.name)::json,
        json_build_object('geometry',ST_AsGeoJSON(ST_Intersection(st.geometry, int_2.geometry))::json, 'name', int_2.name)::json
    ] as intersections
FROM 
    (SELECT 
        name, 
        geometry, 
        municipality 
    FROM ${fn_call_1} JOIN streets USING(street_id)
    ) as st,
    (SELECT 
        name, 
        geometry 
    FROM ${fn_call_2} JOIN streets USING(street_id)
    ) as int_1,
    (SELECT 
        name, 
        geometry 
    FROM ${fn_call_3} JOIN streets USING(street_id)
    ) as int_2
WHERE 
    ST_Intersects(st.geometry, int_1.geometry)
AND 
    ST_Intersects(st.geometry, int_2.geometry)
`;
const find_street_in_between = (db, address) => {
    const { street, between: [int_1, int_2] } = address;
    return db.query(find_street_in_between_factory('find_streets($1)', 'find_streets($2)', 'find_streets($3)'), [
        format_query_parts(street.name),
        format_query_parts(int_1.name),
        format_query_parts(int_2.name)
    ]);
};
const find_street_in_between_within_municipality = (db, address) => {
    const { street, between: [int_1, int_2], municipality } = address;
    return db.query(find_street_in_between_factory('find_streets_within_municipality($1, $4)', 'find_streets_within_municipality($2, $4)', 'find_streets_within_municipality($3, $4)'), [
        format_query_parts(street.name),
        format_query_parts(int_1.name),
        format_query_parts(int_2.name),
        format_query_parts(municipality)
    ]);
};
const format_query_parts = (q) => q.split(' ').join(' & ');
const find_streets = (db, { street }) => db.query(find_streets_factory('find_streets($1)'), [format_query_parts(street.name)]);
const find_streets_within_municipality = (db, { street, municipality }) => db.query(find_streets_factory('find_streets_within_municipality($1, $2)'), [format_query_parts(street.name), format_query_parts(municipality)]);
const find_intersection = (db, street_1, street_2) => db.query(find_intersection_factory('find_streets($1)', 'find_streets($2)'), [format_query_parts(street_1), format_query_parts(street_2)]);
const find_intersection_within_municipality = (db, street_1, street_2, municipality) => db.query(find_intersection_factory('find_streets_within_municipality($1, $3)', 'find_streets_within_municipality($2, $3)'), [format_query_parts(street_1), format_query_parts(street_2), format_query_parts(municipality)]);
exports.handler = db => async (ctx, next) => {
    // @ts-ignore
    const { search } = ctx.query;
    console.log(ctx.query);
    const normalized = normalize_address_1.create_address(search);
    let fn;
    if (normalized.between) {
        fn = normalized.municipality ?
            find_street_in_between_within_municipality :
            find_street_in_between;
    }
    else if (normalized.street) {
        fn = normalized.municipality ?
            find_streets_within_municipality :
            find_streets;
    }
    console.log(normalized);
    if (!fn) {
        ctx.throw(422, 'could not understand address');
    }
    const { rows } = await fn(db, normalized);
    ctx.body = rows;
};
