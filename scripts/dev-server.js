"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mount = require("koa-mount");
const Koa = require("koa");
const app_1 = require("../src/api/users/app");
const app = new Koa();
app.use(mount('/users', app_1.default()));
app.listen(3000);
