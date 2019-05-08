import {Context} from 'koa';
import {create_app} from '../../utils/app';
import * as schema from 'koa-json-schema';

const endpoint = async (ctx: Context, next: Function) => {
    ctx.body = {
        name: 'details',
        query: ctx.query
    };
    await next();
};

export default create_app(app => {
    // app.use(schema({
    //     user: {
    //         type: 'number'
    //     },
    //     required: ['user']
    // }));
    app.use(endpoint);
});
