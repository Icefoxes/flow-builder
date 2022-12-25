import { createApi } from '@reduxjs/toolkit/query/react'
import { Team } from '../model';
import { SharedBaseQuery } from './shared';

export const teamApi = createApi({
    reducerPath: 'teamApi',
    baseQuery: SharedBaseQuery,
    endpoints: (builder) => ({
        getTeams: builder.query<Team[], void>({
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
                    url: `/teams/${team._id}`,
                    method: 'PUT',
                    body: team
                }
            }
        }),
        deleteTeam: builder.mutation<string, string>({
            query: (teamId) => {
                return {
                    url: `/teams/${teamId}`,
                    method: 'DELETE'
                }
            }
        }),
    }),
})

export const { useGetTeamsQuery, useDeleteTeamMutation, useCreateTeamMutation, useUpdateTeamMutation } = teamApi;