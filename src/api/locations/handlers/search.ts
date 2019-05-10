import {Context} from 'koa';
import {Location_search_query_body, Location_search_response_item} from '../../../lib/interfaces';

export const handler = db => async (ctx: Context, next: Function) => {
    // @ts-ignore
    const {query}: Location_search_query_body = ctx.query;
    const [last_word, ...others] = query.split(' ').reverse();
    const query_value = [`${last_word}:*`, ...others].join(' & ');
    const {rows} = await db.query(`
SELECT 
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number',"addr:number",'street',"addr:street", 'municipality', "addr:municipality") as address,
    description
FROM find_suggestions('${query_value}') 
JOIN points_of_interest USING(poi_id);`);
    ctx.body = <Location_search_response_item[]>rows;
};
