BEGIN;

WITH poi AS (SELECT
    name,
    coalesce(
        amenity,
        tourism,
        sport,
        historic,
        place,
        public_transport,
        highway,
        railway,
        "natural",
        leisure,
        man_made,
        military,
        aeroway,
        waterway,
        landuse,
        shop,
        building,
        office,
        tags -> 'attraction',
        tags -> 'club',
        tags -> 'craft',
        tags -> 'healthcare',
        tags -> 'health_care',
        tags -> 'internet_access'
    ) AS category,
    way as geometry,
    setweight(to_tsvector('cuba',COALESCE(name,'')),'A') ||
    setweight(to_tsvector('cuba',COALESCE(tags -> 'addr:street','')),'B') ||
    setweight(to_tsvector('cuba',COALESCE(tags -> 'description','')),'C')
    AS vector,
    tags -> 'addr:housenumber' AS house_number,
    tags -> 'addr:street' AS street_name,
    tags -> 'description' AS description,
    osm_id

FROM planet_osm_point
WHERE name IS NOT NULL
),
municipios as ( SELECT
    name,
    geometry
FROM municipalities)
INSERT INTO points_of_interest(
    name,
    category,
    geometry,
    vector,
    house_number,
    street_name,
    municipality_name,
    description,
    osm_id
)
SELECT
    poi.name,
    CASE WHEN category = 'yes' THEN null
         ELSE category
    END,
    poi.geometry,
    vector,
    house_number,
    street_name,
    municipios.name as municipality_name,
    description,
    osm_id
FROM poi
JOIN municipios ON ST_Within(poi.geometry, municipios.geometry);

--set of words used in names which could be used to rewrite typo and suggest correction
--DROP TABLE IF EXISTS words CASCADE;
--CREATE TABLE words as
--SELECT
--    word,
--    ndoc as doc_count,
--    nentry as entry_count,
--    to_tsquery('cuba', word) as vector
--FROM ts_stat('select to_tsvector(''simple'', name) from points_of_interest');
--
--CREATE INDEX words_idx ON words USING GIN (word gin_trgm_ops);

COMMIT;
