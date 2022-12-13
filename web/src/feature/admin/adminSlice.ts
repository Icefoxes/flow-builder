import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { flowApi, teamApi } from '../../service'
import { Flow, Team } from '../../model'
import { RootState } from '../../store'

export interface AdminState {
  activeFlow: Flow | null;
  activeTeam: string | null;
  teams: Team[];
  flows: Flow[];
}

const initialState: AdminState = {
  activeFlow: null,
  activeTeam: null,
  teams: [],
  flows: [],
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
      state.activeTeam = action.payload.id;
    },
    setActiveFlow: (state, action: PayloadAction<Flow>) => {
      state.activeFlow = action.payload
    }
  },
  extraReducers(builder) {
    builder.addMatcher(flowApi.endpoints.getFlowById.matchFulfilled, (state, { payload }) => {
      state.activeFlow = payload
    });
    builder.addMatcher(flowApi.endpoints.updateFlow.matchFulfilled, (state, { payload }) => {
      state.activeFlow = payload
    });
    builder.addMatcher(flowApi.endpoints.createFlow.matchFulfilled, (state, { payload }) => {
      state.activeFlow = payload;
    });
    builder.addMatcher(teamApi.endpoints.getTeams.matchFulfilled, (state, { payload }) => {
      state.teams = payload
    });
    builder.addMatcher(teamApi.endpoints.createTeam.matchFulfilled, (state, { payload }) => {
      state.teams = [...state.teams, payload]
    });

  },
})

export const { addTeam, setActiveFlow } = adminSlice.actions

export const selectActiveFlow = (state: RootState) => state.admin.activeFlow;

export const selectTeams = (state: RootState) => state.admin.teams;