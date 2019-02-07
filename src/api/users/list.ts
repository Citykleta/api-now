import {Context} from 'koa';

export default async (ctx: Context, next: Function) => {
    ctx.body = [{
        id: 1,
        name: 'Laurent RENARD'
    }];
    await next();
};
