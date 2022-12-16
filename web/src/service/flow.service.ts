import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Flow, FlowLight, SearchItem } from '../model';

// Define a service using a base URL and expected endpoints
export const flowApi = createApi({
    reducerPath: 'flowApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
    endpoints: (builder) => ({
        getFlows: builder.query<FlowLight[], void>({
            query: () => `/flows`
        }),
        getFlowById: builder.query<Flow, { id: string }>({
            query: ({ id }) => `/flows/${id}`
        }),
        createFlow: builder.mutation<Flow, { flow: Flow }>({
            query: ({ flow }) => {
                return {
                    url: `/flows`,
                    method: 'POST',
                    body: flow
                }
            }
        }),
        updateFlow: builder.mutation<Flow, { flow: Flow }>({
            query: ({ flow }) => {
                return {
                    url: `/flows`,
                    method: 'PATCH',
                    body: flow
                }
            }
        }),
        deleteFlow: builder.mutation<FlowLight, { flow: FlowLight }>({
            query: ({ flow }) => {
                return {
                    url: `/flows`,
                    method: 'DELETE',
                    body: flow
                }
            }
        }),
        searchNode: builder.query<SearchItem[], { q: string }>({
            query: ({ q }) => `/nodes/search?q=${q}`
        })
    }),
})

export const { useGetFlowsQuery, useLazySearchNodeQuery, useLazyGetFlowByIdQuery, useDeleteFlowMutation, useCreateFlowMutation, useUpdateFlowMutation, useGetFlowByIdQuery } = flowApi;