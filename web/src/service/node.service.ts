import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Flow } from '../model';

// Define a service using a base URL and expected endpoints
export const flowApi = createApi({
    reducerPath: 'flowApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
    endpoints: (builder) => ({
        getFlowsByTeam: builder.query<Flow[], { id: string }>({
            query: ({ id }) => `/teams/${id}/flows`
        }),
        getFlowById: builder.query<Flow, { teamId: string, diagramId: string }>({
            query: ({ teamId, diagramId }) => `/teams/${teamId}/flows/${diagramId}`
        }),
        updateFlow: builder.mutation<Flow, { flow: Flow }>({
            query: ({ flow }) => {
                return {
                    url: `/teams/${flow.team}/flows/${flow.id}`,
                    method: 'PATCH',
                    body: flow
                }
            }
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
    }),
})

export const { useLazyGetFlowsByTeamQuery, useCreateFlowMutation, useUpdateFlowMutation, useGetFlowByIdQuery } = flowApi;