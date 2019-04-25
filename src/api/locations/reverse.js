"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../utils/app");
const body = require("koa-bodyparser");
const koa_json_schema_1 = require("koa-json-schema");
const GeoCoder = require("node-geocoder");
const endpoint = async (ctx, next) => {
    // @ts-ignore
    const { lat, lng } = ctx.request.body;
    const geocoding = GeoCoder({
        provider: 'openstreetmap'
    });
    const queryObject = {
        lat,
        lon: lng
    };
    ctx.body = await geocoding
        .reverse(queryObject);
};
const schemaDefinition = {
    type: 'object',
    properties: {
        lng: {
            type: 'number'
        },
        lat: {
            type: 'number'
        }
    },
    required: ['lng', 'lat']
};
exports.default = app_1.createApp(app => {
    app.use(body());
    app.use(koa_json_schema_1.middleware(schemaDefinition));
    app.use(endpoint);
});
