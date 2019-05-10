import {Context} from 'koa';
import {Reverse_search_response_item} from '../../../lib/interfaces';

export const handler = db => async (ctx: Context, next: Function) => {
    // @ts-ignore
    const {lng, lat} = ctx.query;
    const {rows} = await db.query(`
SELECT 
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    distance,
    json_build_object('number',"addr:number",'street',"addr:street", 'municipality', "addr:municipality") as address
FROM find_suggestions_closed_to(${lng},${lat}) JOIN points_of_interest USING(poi_id);`);
    ctx.body = <Reverse_search_response_item[]>rows;
};
