import {Context} from 'koa';
import {Reverse_search_response_item} from '../../../lib/interfaces';

export const handler = db => async (ctx: Context, next: Function) => {
    // @ts-ignore
    const {lng, lat} = ctx.query;
    const {rows} = await db.query(`
SELECT 
    poi_id as id,
    'point_of_interest' as type,
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number', house_number, 'street', street_name, 'municipality', municipality_name) as address,
    description,
    distance
FROM find_suggestions_closed_to($1, $2) JOIN points_of_interest USING(poi_id)
LIMIT 5
;`,[lng,lat]);
    ctx.body = <Reverse_search_response_item[]>rows;
};
