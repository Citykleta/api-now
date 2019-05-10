import {create_app} from '../../lib/app';
import * as  body from 'koa-bodyparser';
import {middleware as schema} from 'koa-json-schema';
import conf from '../../conf/index';
import {Pool} from 'pg';
import cache from '../../lib/middlewares/cache';
import {handler} from './handlers/details';

const db_pool = new Pool(conf.db);
const schema_definition = {
    type: 'object',
    properties: {
        id: {
            type: 'number'
        }
    },
    required: ['id']
};

export default create_app(app => {
    app.use(body());
    app.use(schema(schema_definition, {
        coerceTypes: true
    }));
    app.use(cache());
    app.use(handler(db_pool));
});
