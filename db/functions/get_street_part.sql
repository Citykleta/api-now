CREATE OR REPLACE FUNCTION get_street_part(
    street geometry(LineString, 4326),
    intersection_1 geometry(Point, 4326),
    intersection_2 geometry(Point, 4326)
) RETURNS geometry(LineString, 4326)
AS $$
    SELECT ST_LineSubstring(
        street,
        least(ST_LineLocatePoint(street, intersection_1),ST_LineLocatePoint(street, intersection_2)),
        greatest(ST_LineLocatePoint(street, intersection_1),ST_LineLocatePoint(street, intersection_2))
    ) as geometry
$$
LANGUAGE SQL
STABLE
LEAKPROOF
PARALLEL SAFE;
