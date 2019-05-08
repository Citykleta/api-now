import {Context} from 'koa';
import {create_app} from '../../utils/app';
import {middleware as schema} from 'koa-json-schema';
import conf from '../../conf';
import {Pool} from 'pg';
import cache from '../../utils/middlewares/cache';
import {Reverse_search_response_item} from '../../utils/interfaces';

const db_pool = new Pool(conf.db);

const endpoint = db => async (ctx: Context, next: Function) => {
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

const schema_definition = {
    type: 'object',
    properties: {
        lng: {
            type: 'number'
        },
        lat: {
            type: 'number'
        }
    },
    required: ['lng', 'lat']
};

export default create_app(app => {
    app.use(schema(schema_definition, {coerceTypes: true}));
    app.use(cache());
    app.use(endpoint(db_pool));
});
