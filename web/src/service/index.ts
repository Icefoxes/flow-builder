import { flowApi } from './node.service';
import { teamApi } from './team.service';
export * from './node.service';
export * from './team.service';


export const serviceReducer = {
    [flowApi.reducerPath]: flowApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer
}

export const serviceMiddlewares = [flowApi.middleware, teamApi.middleware];

