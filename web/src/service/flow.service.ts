import { createApi } from '@reduxjs/toolkit/query/react'
import { Flow, FlowInfo, FlowLight, SearchItem } from '../model';
import { SharedBaseQuery } from './shared';

// Define a service using a base URL and expected endpoints
export const flowApi = createApi({
    reducerPath: 'flowApi',
    baseQuery: SharedBaseQuery,
    endpoints: (builder) => ({
        getFlows: builder.query<FlowLight[], void>({
            query: () => `/flows`
        }),
        getFlowById: builder.query<Flow, string>({
            query: (id) => `/flows/${id}`
        }),
        getFlowByAlias: builder.query<Flow, string>({
            query: (alias) => `/flows?alias=${alias}`
        }),
        createFlow: builder.mutation<Flow, FlowInfo>({
            query: (flow) => {
                return {
                    url: `/flows`,
                    method: 'POST',
                    body: flow
                }
            }
        }),
        updateFlow: builder.mutation<Flow, Flow>({
            query: (flow) => {
                return {
                    url: `/flows/${flow._id}`,
                    method: 'PUT',
                    body: flow
                }
            }
        }),
        deleteFlow: builder.mutation<string, string>({
            query: (flowId) => {
                return {
                    url: `/flows/${flowId}`,
                    method: 'DELETE'
                }
            }
        }),
        searchNode: builder.query<SearchItem[], { q: string }>({
            query: ({ q }) => `/nodes/search?q=${q}`
        })
    }),
})

export const { useGetFlowsQuery, useGetFlowByAliasQuery, useGetFlowByIdQuery, useLazySearchNodeQuery, useLazyGetFlowByIdQuery, useDeleteFlowMutation, useCreateFlowMutation, useUpdateFlowMutation } = flowApi;