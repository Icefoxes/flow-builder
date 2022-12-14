import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { flowApi, teamApi } from '../../service'
import { Flow, FlowLight, Team } from '../../model'
import { RootState } from '../../store'

export interface AdminState {
  activeFlow: Flow | null;
  teams: Team[];
  flows: FlowLight[];
}

const initialState: AdminState = {
  activeFlow: null,
  teams: [],
  flows: [],
}

const transformToFlowLight = (payload: Flow) => {
  return {
    id: payload.id,
    team: payload.team,
    name: payload.name,
    tag: payload.tag
  } as FlowLight
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setActiveFlow: (state, action: PayloadAction<Flow>) => {
      state.activeFlow = action.payload
    }
  },
  extraReducers(builder) {
    builder.addMatcher(flowApi.endpoints.createFlow.matchFulfilled, (state, { payload }) => {
      state.activeFlow = payload;
      state.flows = [...state.flows, transformToFlowLight(payload)];
    });

    builder.addMatcher(flowApi.endpoints.getFlows.matchFulfilled, (state, { payload }) => {
      state.flows = payload;
    });
    builder.addMatcher(flowApi.endpoints.getFlowById.matchFulfilled, (state, { payload }) => {
      state.activeFlow = payload
    });

    builder.addMatcher(flowApi.endpoints.updateFlow.matchFulfilled, (state, { payload }) => {
      state.activeFlow = payload;
      state.flows = [...state.flows.filter(f => f.id !== payload.id), transformToFlowLight(payload)];
    });

    builder.addMatcher(flowApi.endpoints.deleteFlow.matchFulfilled, (state, { payload }) => {
      state.flows = [...state.flows.filter(flow => flow.id !== payload.id)];
    });

    // team api
    builder.addMatcher(teamApi.endpoints.getTeams.matchFulfilled, (state, { payload }) => {
      state.teams = payload;
    });
    builder.addMatcher(teamApi.endpoints.createTeam.matchFulfilled, (state, { payload }) => {
      state.teams = [...state.teams, payload];
    });
    builder.addMatcher(teamApi.endpoints.updateTeam.matchFulfilled, (state, { payload }) => {
      state.teams = [...state.teams.filter(team => team.id !== payload.id), payload];
    });
    builder.addMatcher(teamApi.endpoints.deleteTeam.matchFulfilled, (state, { payload }) => {
      state.teams = [...state.teams.filter(t => t.id !== payload.id)];
    });
  },
})

export const { setActiveFlow } = adminSlice.actions

export const selectActiveFlow = (state: RootState) => state.admin.activeFlow;

export const selectTeams = (state: RootState) => state.admin.teams;

export const selectFlows = (state: RootState) => state.admin.flows;