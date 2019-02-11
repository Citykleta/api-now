import {Context} from 'koa';
import {createApp} from '../../utils/app';
import * as schema from 'koa-json-schema';

const endpoint = async (ctx: Context, next: Function) => {
    ctx.body = {
        name: 'details',
        query: ctx.query
    };
    await next();
};

export default createApp(app => {
    // app.use(schema({
    //     user: {
    //         type: 'number'
    //     },
    //     required: ['user']
    // }));
    app.use(endpoint);
});
