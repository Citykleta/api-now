import {Context} from 'koa';

export default async (ctx: Context, next: Function) => {
    const {id} = ctx.params;
    ctx.body = {
        id,
        name: 'foooooo'
    };
    await next();
};
