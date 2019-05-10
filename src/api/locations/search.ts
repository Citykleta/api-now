import {create_app} from '../../lib/app';
import {middleware as schema} from 'koa-json-schema';
import conf from '../../conf/index';
import {Pool} from 'pg';
import cache from '../../lib/middlewares/cache';
import timer from '../../lib/middlewares/server-timing';
import {handler} from './handlers/search';

const db_pool = new Pool(conf.db);
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
    app.use(handler(db_pool));
});
