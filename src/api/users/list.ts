import {Context} from 'koa';
import {createApp} from '../../utils/app';

const endpoint = async (ctx: Context, next: Function) => {
    ctx.response.body = [{
        id: 1,
        name: 'Laurent RENARD'
    }];
    await next();
};

export default createApp(app => app.use(endpoint));
