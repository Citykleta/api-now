import {Context} from 'koa';
import {create_app} from '../../utils/app';

const endpoint = async (ctx: Context, next: Function) => {
    ctx.response.body = [{
        id: 1,
        name: 'Laurent RENARD'
    }];
    await next();
};

export default create_app(app => app.use(endpoint));
