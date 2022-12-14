import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Team } from '../model';

export const teamApi = createApi({
    reducerPath: 'teamApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
    endpoints: (builder) => ({
        getTeams: builder.query<Team[], {}>({
            query: () => `/teams`
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
        updateTeam: builder.mutation<Team, Team>({
            query: (team) => {
                return {
                    url: `/teams`,
                    method: 'PATCH',
                    body: team
                }
            }
        }),
        deleteTeam: builder.mutation<Team, Team>({
            query: (team) => {
                return {
                    url: `/teams`,
                    method: 'DELETE',
                    body: team
                }
            }
        }),
    }),
})

export const { useGetTeamsQuery, useDeleteTeamMutation, useCreateTeamMutation, useUpdateTeamMutation } = teamApi;