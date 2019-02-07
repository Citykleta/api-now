import * as mount from 'koa-mount';
import * as Koa from 'koa';
import users from '../src/api/users/app';

const app = new Koa();
app.use(mount('/users', users()));
app.listen(3000);
