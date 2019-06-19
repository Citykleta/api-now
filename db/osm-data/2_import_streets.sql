BEGIN;

WITH osm_streets AS (SELECT
    name,
    osm_id,
    highway as category,
    way as geometry,
    to_tsvector('cuba_streets',name) as vector
FROM planet_osm_line
WHERE name is not null
    AND highway is not null
    AND highway != 'yes'
)
INSERT INTO streets(
    name,
    osm_id,
    category,
    geometry,
    vector
) SELECT
    name,
    osm_id,
    category,
    geometry,
    vector
FROM osm_streets;

COMMIT;
