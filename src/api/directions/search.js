"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../utils/app");
const body = require("koa-bodyparser");
const koa_json_schema_1 = require("koa-json-schema");
const direction_service = require("@mapbox/mapbox-sdk/services/directions");
const index_1 = require("../../conf/index");
const endpoint = async (ctx) => {
    // @ts-ignore;
    const { waypoints } = ctx.request.body;
    const service = direction_service({
        accessToken: index_1.default.mapbox.token
    });
    const mapbox_request_config = {
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
            .getDirections(mapbox_request_config)
            .send();
        ctx.body = response.body;
    }
    catch (e) {
        ctx.throw(503);
    }
};
const schema_definition = {
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
exports.default = app_1.create_app(app => {
    app.use(body());
    app.use(koa_json_schema_1.middleware(schema_definition));
    app.use(endpoint);
});
