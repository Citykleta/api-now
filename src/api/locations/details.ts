import {Context} from 'koa';
import {create_app} from '../../utils/app';
import * as  body from 'koa-bodyparser';
import {middleware as schema} from 'koa-json-schema';
import conf from '../../conf/index';
import {Pool} from 'pg';
import cache from '../../utils/middlewares/cache';

const db_pool = new Pool(conf.db);

const endpoint = db => async (ctx: Context, next: Function) => {
    const {id} = ctx.params;
    const {rows} = await db.query(`
SELECT
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    description,
    json_build_object('number',"addr:number",'street',"addr:street", 'municipality', "addr:municipality") as address
FROM points_of_interest
WHERE poi_id = $1
`, [id]);

    if (!rows.length) {
        ctx.throw(404);
    }

    ctx.body = rows[0];
};


export default create_app(app => {
    app.use(body());
    const schema_definition = {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            }
        },
        required: ['id']
    };
    app.use(schema(schema_definition, {
        coerceTypes: true
    }));
    app.use(cache());
    app.use(endpoint(db_pool));
});
