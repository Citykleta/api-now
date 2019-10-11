"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/conf/index"));
const pg_1 = require("pg");
const db_pool = new pg_1.Pool(index_1.default.db);
(async () => {
    try {
        const { rows } = await db_pool.query(`
        WITH bicycle_data as (
            SELECT * FROM points_of_interest WHERE category ILIKE '%bicycle%'
        )
        SELECT row_to_json(data) as "geojson"
        FROM (
            SELECT 
                'FeatureCollection' as type,
                COALESCE(array_to_json(array_agg(poi)),'[]')as "features"
            FROM (
                SELECT
                    'Feature' as type,
                    ST_AsGeoJSON(geometry, 6)::json as "geometry",
                    json_build_object('name',name,'category',category,'description',description) as "properties"
                FROM bicycle_data
            ) as poi
        ) as data;
        `);
        console.log(JSON.stringify(rows[0].geojson));
    }
    catch (e) {
        console.error(e);
    }
    finally {
        db_pool.end();
    }
})();
// ST_AsText(ST_Envelope(ST_Collect(mu.geometry)))
