CREATE OR REPLACE FUNCTION find_suggestions(
    varchar,
    out poi_id integer,
    out rank real
) RETURNS SETOF RECORD
AS $$
    SELECT
        poi_id,
        ts_rank(poi.vector, to_tsquery('cuba', $1)) as rank
    FROM
        points_of_interest as poi
    WHERE
        vector @@ to_tsquery('cuba', $1)
    ORDER BY rank DESC
$$
LANGUAGE SQL
STABLE
LEAKPROOF
PARALLEL SAFE;
