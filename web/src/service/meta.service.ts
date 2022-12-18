import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { NodeTypeMeta } from '../model';

// Define a service using a base URL and expected endpoints
export const metaApi = createApi({
    reducerPath: 'metaApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
    endpoints: (builder) => ({
        getMeta: builder.query<NodeTypeMeta[], void>({
            query: () => `/metas`
        }),
        getMetaById: builder.query<NodeTypeMeta, { id: string }>({
            query: ({ id }) => `/metas/${id}`
        }),
        createMeta: builder.mutation<NodeTypeMeta, { meta: NodeTypeMeta }>({
            query: ({ meta }) => {
                return {
                    url: `/metas`,
                    method: 'POST',
                    body: meta
                }
            }
        }),
        updateMeta: builder.mutation<NodeTypeMeta, { meta: NodeTypeMeta }>({
            query: ({ meta }) => {
                return {
                    url: `/metas`,
                    method: 'PATCH',
                    body: meta
                }
            }
        }),
        deleteMeta: builder.mutation<NodeTypeMeta, { meta: NodeTypeMeta }>({
            query: ({ meta }) => {
                return {
                    url: `/metas`,
                    method: 'DELETE',
                    body: meta
                }
            }
        }),
    }),
})

export const { useGetMetaQuery, useGetMetaByIdQuery, useCreateMetaMutation, useDeleteMetaMutation, useUpdateMetaMutation } = metaApi;