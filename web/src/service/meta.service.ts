import { createApi } from '@reduxjs/toolkit/query/react'
import { NodeTypeMeta, NodeTypeMetaInfo } from '../model';
import { SharedBaseQuery } from './shared';

// Define a service using a base URL and expected endpoints
export const metaApi = createApi({
    reducerPath: 'metaApi',
    baseQuery: SharedBaseQuery,
    endpoints: (builder) => ({
        getMeta: builder.query<NodeTypeMeta[], void>({
            query: () => `/metas`
        }),
        getMetaById: builder.query<NodeTypeMeta, string>({
            query: (metaId) => `/metas/${metaId}`
        }),
        createMeta: builder.mutation<NodeTypeMeta, NodeTypeMetaInfo>({
            query: (meta) => {
                return {
                    url: `/metas`,
                    method: 'POST',
                    body: meta
                }
            }
        }),
        updateMeta: builder.mutation<NodeTypeMeta, NodeTypeMeta>({
            query: (meta) => {
                return {
                    url: `/metas/${meta._id}`,
                    method: 'PUT',
                    body: meta
                }
            }
        }),
        deleteMeta: builder.mutation<string, string>({
            query: (metaId) => {
                return {
                    url: `/metas/${metaId}`,
                    method: 'DELETE'
                }
            }
        }),
    }),
})

export const { useGetMetaQuery, useGetMetaByIdQuery, useCreateMetaMutation, useDeleteMetaMutation, useUpdateMetaMutation } = metaApi;