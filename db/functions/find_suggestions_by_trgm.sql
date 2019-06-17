CREATE OR REPLACE FUNCTION find_suggestions_by_trgm(
    varchar,
    out poi_id integer,
    out distance real
) RETURNS SETOF RECORD
AS $$
    SELECT
        poi_id,
        name <-> $1 as distance
    FROM
        points_of_interest as poi
    ORDER BY distance
$$
LANGUAGE SQL
STABLE
LEAKPROOF
PARALLEL SAFE;
