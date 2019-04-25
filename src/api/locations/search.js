"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../utils/app");
const body = require("koa-bodyparser");
const koa_json_schema_1 = require("koa-json-schema");
const GeoCoder = require("node-geocoder");
const constants_1 = require("../../utils/constants");
const format = (input) => input
    .filter(i => i.country === 'Cuba' && i.state === 'La Habana')
    .map(i => {
    const parts = i.formattedAddress.split(',');
    const address = {
        number: i.streetNumber,
        street: i.streetName,
        formatted: i.formattedAddress
        //todo municipality
    };
    return {
        name: parts[0] || address.street || '',
        lat: i.latitude,
        lng: i.longitude,
        address
    };
});
const endpoint = async (ctx, next) => {
    // @ts-ignore
    const { query, proximity } = ctx.request.body;
    const geocoding = GeoCoder({
        provider: 'openstreetmap'
    });
    const queryObject = {
        city: 'La Habana',
        state: 'La Habana',
        country: 'Cuba',
        countrycodes: 'cu',
        viewbox: constants_1.HAVANA_BOUNDING_BOX.join(','),
        q: query,
        dedupe: true
    };
    const response = await geocoding.geocode(queryObject);
    ctx.body = format(response);
};
const schemaDefinition = {
    type: 'object',
    properties: {
        query: {
            type: 'string'
        },
        proximity: {
            type: 'object',
            properties: {
                ln: {
                    type: 'number',
                },
                lat: {
                    type: 'number'
                }
            },
            required: ['ln', 'lat']
        }
    },
    required: ['query']
};
exports.default = app_1.createApp(app => {
    app.use(body());
    app.use(koa_json_schema_1.middleware(schemaDefinition));
    app.use(endpoint);
});
