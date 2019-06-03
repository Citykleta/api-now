import {Context} from 'koa';
import {Location_search_query_body, Location_search_response_item} from '../../../lib/interfaces';

export const handler = db => async (ctx: Context, next: Function) => {
    // @ts-ignore
    const {search}: Location_search_query_body = ctx.query;
    const [last_word, ...others] = search
        .split(' ')
        .filter(w => w !== '')
        .reverse();
    const query_value = [`${last_word}:*`, ...others].join(' & ');
    const {rows} = await db.query(`
SELECT 
    poi_id as id,
    'point_of_interest' as type,
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number', house_number, 'street', street_name, 'municipality', municipality_name) as address,
    description
FROM find_suggestions($1) 
JOIN points_of_interest USING(poi_id)
LIMIT 5
;`, [query_value]);
    ctx.body = <Location_search_response_item[]>rows;
};
