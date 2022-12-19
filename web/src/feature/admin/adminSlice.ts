import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { flowApi, metaApi, teamApi } from '../../service'
import { Flow, FlowLight, Team } from '../../model'
import { RootState } from '../../store'
import { NodeTypeMeta } from '../../model/meta';

export interface AdminState {
  activeFlow: Flow | null;
  teams: Team[];
  flows: FlowLight[];
  nodeMeta: NodeTypeMeta[];
}

const initialState: AdminState = {
  activeFlow: null,
  teams: [],
  flows: [],
  nodeMeta: []
}

const transformToFlowLight = (payload: Flow): FlowLight => {
  return {
    id: payload.id,
    team: payload.team,
    name: payload.name,
    tag: payload.tag,
    alias: payload.alias
  }
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
    builder.addMatcher(flowApi.endpoints.getFlowByAlias.matchFulfilled, (state, { payload }) => {
      state.activeFlow = payload
    });
    builder.addMatcher(flowApi.endpoints.updateFlow.matchFulfilled, (state, { payload }) => {
      state.activeFlow = payload;
      state.flows = [...state.flows.filter(f => f.id !== payload.id), transformToFlowLight(payload)];
    });

    builder.addMatcher(flowApi.endpoints.deleteFlow.matchFulfilled, (state, { payload }) => {
      state.activeFlow = null;
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

    // meta api

    builder.addMatcher(metaApi.endpoints.getMeta.matchFulfilled, (state, { payload }) => {
      state.nodeMeta = payload;
      localStorage.setItem('META', JSON.stringify(state.nodeMeta));
    });
    builder.addMatcher(metaApi.endpoints.createMeta.matchFulfilled, (state, { payload }) => {
      state.nodeMeta = [...state.nodeMeta, payload];
      localStorage.setItem('META', JSON.stringify(state.nodeMeta));
    });
    builder.addMatcher(metaApi.endpoints.updateMeta.matchFulfilled, (state, { payload }) => {
      state.nodeMeta = [...state.nodeMeta.filter(meta => meta._id !== payload._id), payload];
      localStorage.setItem('META', JSON.stringify(state.nodeMeta));
    });
    builder.addMatcher(metaApi.endpoints.deleteMeta.matchFulfilled, (state, { payload }) => {
      state.nodeMeta = [...state.nodeMeta.filter(t => t._id !== payload._id)];
      localStorage.setItem('META', JSON.stringify(state.nodeMeta));
    });
  },
})

export const { setActiveFlow } = adminSlice.actions

export const selectActiveFlow = (state: RootState) => state.admin.activeFlow;

export const selectTeams = (state: RootState) => state.admin.teams;

export const selectFlows = (state: RootState) => state.admin.flows;

export const selectNodeMetaData = (state: RootState) => state.admin.nodeMeta;