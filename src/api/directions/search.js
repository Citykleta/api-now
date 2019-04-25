"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../utils/app");
const body = require("koa-bodyparser");
const koa_json_schema_1 = require("koa-json-schema");
const directionService = require("@mapbox/mapbox-sdk/services/directions");
const index_1 = require("../../conf/index");
const endpoint = async (ctx) => {
    // @ts-ignore;
    const { waypoints } = ctx.request.body;
    const service = directionService({
        accessToken: index_1.default.mapbox.token
    });
    const mapboxConfigObject = {
        profile: 'cycling',
        // steps: true,
        // @ts-ignore
        waypoints: waypoints.map(({ lng, lat }) => ({
            coordinates: [lng, lat],
            radius: 'unlimited'
        }))
    };
    try {
        const response = await service
            .getDirections(mapboxConfigObject)
            .send();
        ctx.body = response.body;
    }
    catch (e) {
        ctx.throw(503);
    }
};
const schemaDefinition = {
    type: 'object',
    properties: {
        waypoints: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    lng: {
                        type: 'number',
                    },
                    lat: {
                        type: 'number'
                    }
                },
                required: ['lng', 'lat']
            },
            minItems: 2
        }
    },
    required: ['waypoints']
};
exports.default = app_1.createApp(app => {
    app.use(body());
    app.use(koa_json_schema_1.middleware(schemaDefinition));
    app.use(endpoint);
});
