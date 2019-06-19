SELECT DISTINCT ON (ST_Intersection(s1.geometry, s2.geometry))
    ARRAY[ s1.name, s2.name] as streets,
    s1.municipality as municipality,
    s1.street_id as s1_id,
    s2.street_id as s2_id
FROM
    (SELECT
        name,
        municipality,
        geometry,
        street_id
    FROM find_streets('10')
    JOIN streets USING(street_id)) as s1,
    (SELECT
        name,
        municipality,
        geometry,
        street_id
    FROM find_streets('5ta')
    JOIN streets using(street_id)) as s2
WHERE ST_Intersects(s1.geometry, s2.geometry);
