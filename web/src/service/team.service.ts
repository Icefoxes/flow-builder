import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Team } from '../model';

// Define a service using a base URL and expected endpoints
export const teamApi = createApi({
    reducerPath: 'teamApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
    endpoints: (builder) => ({
        getTeams: builder.query<Team[], {}>({
            query: () => {
                return {
                    url: '/teams',
                    method: 'GET',
                }
            }
        }),
        updateTeam: builder.mutation<Team, Team>({
            query: (team) => {
                return {
                    url: `/teams`,
                    method: 'PATCH',
                    body: team
                }
            }
        }),
        createTeam: builder.mutation<Team, Team>({
            query: (team) => {
                return {
                    url: `/teams`,
                    method: 'POST',
                    body: team
                }
            }
        }),
    }),
})

export const { useGetTeamsQuery, useCreateTeamMutation, useUpdateTeamMutation } = teamApi;