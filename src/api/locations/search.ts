import {Context} from 'koa';
import {create_app} from '../../utils/app';
import {middleware as schema} from 'koa-json-schema';
import {Location_search_query_body, Location_search_response_item} from '../../utils/interfaces';
import conf from '../../conf/index';
import {Pool} from 'pg';
import cache from '../../utils/middlewares/cache';
import timer from '../../utils/middlewares/server-timing';

const db_pool = new Pool(conf.db);

const endpoint = db => async (ctx: Context, next: Function) => {
    // @ts-ignore
    const {query}: Location_search_query_body = ctx.query;
    const query_value = `${query.split(' ')
        .map(v => `${v}:*`)
        .join(' & ')}`;

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

const schema_definition = {
    type: 'object',
    properties: {
        query: {
            type: 'string'
        }
    },
    required: ['query']
};

export default create_app(app => {
    app.use(schema(schema_definition));
    app.use(cache());
    app.use(timer());
    app.use(endpoint(db_pool));
});
