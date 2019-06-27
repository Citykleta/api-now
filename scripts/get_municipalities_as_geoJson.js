"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/conf/index");
const pg_1 = require("pg");
const db_pool = new pg_1.Pool(index_1.default.db);
(async () => {
    try {
        const { rows } = await db_pool.query(`
        WITH havana_municipios as (
            SELECT * FROM municipalities WHERE name IN (
                'Arroyo Naranjo',
                'Boyeros',
                'Centro Habana',
                'Cerro',
                'Cotorro',
                'Diez de Octubre',
                'Guanabacoa',
                'Habana del Este',
                'La Habana Vieja',
                'La Lisa',
                'Marianao',
                'Playa',
                'Plaza de la Revolución',
                'Regla',
                'San Miguel del Padrón'
            ) ORDER BY name
        )
        SELECT row_to_json(municipios) as "havana"
        FROM (
            SELECT 
                'FeatureCollection' as type,
                array_to_json(array_agg(mu)) as "features"
            FROM (
                SELECT
                    'Feature' as type,
                    ST_AsGeoJSON(geometry, 4)::json as "geometry",
                    json_build_object('name',name) as "properties"
                FROM havana_municipios
            ) as mu
        ) as municipios;
        `);
        console.log(JSON.stringify(rows[0].havana));
    }
    catch (e) {
        console.error(e);
    }
    finally {
        db_pool.end();
    }
})();
// ST_AsText(ST_Envelope(ST_Collect(mu.geometry)))
