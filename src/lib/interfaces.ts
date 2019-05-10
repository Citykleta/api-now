import * as Koa from 'koa';

export interface Endpoint {
    (app: Koa): any;
}

export interface Coordinates {
    lng: number;
    lat: number;
}

export interface Direction_search_query_body {
    waypoints: Coordinates[];
}

export interface Location_search_query_body {
    query: string;
    proximity?: Coordinates;
}

export interface Location_search_response_item {
    id: number;
    name: string;
    category?: string;
    geometry: {
        type: 'Point',
        coordinates: [number, number]
    },
    address: {
        number?: string;
        street?: string;
        municipality?: string;
    },
    description?: string;
}

export interface Reverse_search_response_item extends Location_search_response_item {
    distance: number;
}
