import {Context} from 'koa';
import {create_app} from '../../lib/app';
import timer from '../../lib/middlewares/server-timing';
import cache from '../../lib/middlewares/cache';
import leisure_routes from './data';

const endpoint = async (ctx: Context) => {
    ctx.body = leisure_routes;
};

export default create_app(app => {
    app.use(cache());
    app.use(timer());
    app.use(endpoint);
});