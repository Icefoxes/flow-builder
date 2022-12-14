import { flowApi } from './flow.service';
import { teamApi } from './team.service';
export * from './flow.service';
export * from './team.service';


export const serviceReducer = {
    [flowApi.reducerPath]: flowApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer
}

export const serviceMiddlewares = [flowApi.middleware, teamApi.middleware];

