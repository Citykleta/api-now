BEGIN;

INSERT INTO municipalities(
    name,
    geometry,
    vector,
    osm_id
)
SELECT
    name,
    way as geometry,
    to_tsvector('cuba_streets', name) as vector,
    osm_id
FROM planet_osm_polygon
WHERE admin_level::integer = 6
ORDER BY way_area::numeric DESC -- bug in OSM on municipio "Playa" is duplicate
ON CONFLICT(name) DO NOTHING;

COMMIT;
