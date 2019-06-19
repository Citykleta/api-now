CREATE OR REPLACE FUNCTION find_streets(
    name varchar,
    out street_id integer,
    out municipality varchar,
    out street_rank real
) RETURNS SETOF RECORD
AS $$
    SELECT
        street_id,
        municipalities.name as municipality,
        ts_rank(streets.vector, to_tsquery('cuba_streets', $1)) as street_rank
    FROM streets
    JOIN municipalities
    ON ST_Intersects(streets.geometry, municipalities.geometry)
    WHERE streets.vector @@ to_tsquery('cuba_streets', $1)
    ORDER BY street_rank DESC
$$
LANGUAGE SQL
STABLE
LEAKPROOF
PARALLEL SAFE;
