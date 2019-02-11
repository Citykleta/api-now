import {Context} from 'koa';
import {createApp} from '../../utils/app';
import * as  body from 'koa-bodyparser';
import * as schema from 'koa-json-schema';
import {DirectionSearchQueryBody} from '../../utils/interfaces';
import * as directionService from '@mapbox/mapbox-sdk/services/directions';
import conf from '../../conf/index';
// import service from '@mapbox/directions';

// 23.13012/-82.41617
//23.12694/-82.41304

const endpoint = async (ctx: Context, next: Function) => {
    // @ts-ignore;
    const {waypoints}: DirectionSearchQueryBody = ctx.request.body;

    const service = directionService({
        accessToken: conf.mapbox.token
    });

    const mapboxConfigObject = {
        profile: 'cycling',
        waypoints: waypoints.map(({ln, lat}) => ({
            coordinates: [ln, lat]
        }))
    };

    const response = await service
        .getDirections(mapboxConfigObject)
        .send();

    ctx.body = response.body;
};

const schemaDefinition = {
    type: 'object',
    properties: {
        waypoints: {
            type: 'array',
            items: {
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
            },
            minItems: 2
        }
    },
    required: ['waypoints']
};

export default createApp(app => {
    app.use(body());
    app.use(schema(schemaDefinition));
    app.use(endpoint);
});
