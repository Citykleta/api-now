-- Find street matching a query string within a municipalities matching a query string
-- Return the street_id the municipality name (which is also its primary key) and the ranks of the matching streets and matching municipalities
-- example usage: get every the geometries of streets named "calle 10" within municipio called "playa"
-- select geometry, name from find_streets_within_municipality('calle & 10', 'playa') join streets using(street_id);
CREATE OR REPLACE FUNCTION find_streets_within_municipality(
    name varchar,
    municipality_name varchar,
    out street_id integer,
    out municipality varchar,
    out street_rank real,
    out municipality_rank real
) RETURNS SETOF RECORD
AS $$
    SELECT
        street_id,
        mu.name as municipality,
        ts_rank(st.vector, to_tsquery('cuba_streets', $1)) as street_rank,
        ts_rank(st.vector, to_tsquery('cuba_streets', $1)) as municipality_rank
    FROM
        streets as st
    JOIN municipalities as mu
    ON ST_Intersects(st.geometry, mu.geometry)
    WHERE
        st.vector @@ to_tsquery('cuba_streets', $1)
    AND
        mu.vector @@ to_tsquery('cuba_streets', $2)
    ORDER by street_rank, municipality_rank DESC
$$
LANGUAGE SQL
STABLE
LEAKPROOF
PARALLEL SAFE;
