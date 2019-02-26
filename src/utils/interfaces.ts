import * as Koa from 'koa';

export interface Endpoint {
    (app: Koa): any
}

export interface Coordinates {
    lng: number;
    lat: number;
}

export interface DirectionSearchQueryBody {
    waypoints: Coordinates[];
}

export interface LocationSearchQueryBody {
    query: string;
    proximity?: Coordinates;
}
