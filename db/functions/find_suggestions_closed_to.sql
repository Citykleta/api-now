CREATE OR REPLACE FUNCTION find_suggestions_closed_to(
    lng double precision,
    lat double precision,
    out poi_id integer,
    out distance integer
) RETURNS SETOF RECORD
AS $$
    SELECT
        poi_id,
        round(ST_Distance(
            ST_Transform(poi.geometry, 3857),
            ST_Transform(ST_SetSRID(ST_MakePoint(lng,lat),4326),3857)
        ))::integer as distance
    FROM points_of_interest as poi
    WHERE ST_DWithin(
        poi.geometry,
        ST_SetSRID(ST_MakePoint(lng,lat),4326),
        -- roughly 50m
        0.0005
    )
    ORDER BY distance
$$
LANGUAGE SQL
STABLE
LEAKPROOF
PARALLEL SAFE;

