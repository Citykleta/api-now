import {Context} from 'koa';

export default () => async (ctx: Context, next: Function) => {
    ctx.status = 200;
    try {
        await next();
    } catch (e) {
        if (process.env.NODE_ENV !== 'test') {
            console.error(e);
        }
        ctx.status = e.status || 500;
    }
};
