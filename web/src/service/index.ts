import { flowApi } from './flow.service';
import { metaApi } from './meta.service';
import { teamApi } from './team.service';
export * from './flow.service';
export * from './team.service';
export * from './meta.service';

export const serviceReducer = {
    [flowApi.reducerPath]: flowApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [metaApi.reducerPath]: metaApi.reducer,
}

export const serviceMiddlewares = [flowApi.middleware, teamApi.middleware, metaApi.middleware];

