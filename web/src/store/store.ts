import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import Slices from '../feature/slice';
import { serviceMiddlewares, serviceReducer } from '../service';


export const store = configureStore({
    reducer: {
        ...Slices,
        ...serviceReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(serviceMiddlewares),
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)