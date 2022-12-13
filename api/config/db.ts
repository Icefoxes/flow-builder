import { Flow, NodeType } from "../model";
import { Team } from "../model/team.model";


type Data = {
    teams: Team[],
    flows: Flow[]
}


const db: Data = {
    teams: [{
        id: '1',
        name: 'Data Team',
        description: 'Gnomon data Team',
    },
    {
        id: '2',
        name: 'Quants Team',
        description: 'Gnomon data Team',
    }],
    flows: [{
        id: '1',
        team: '1',
        name: 'Treasury',
        tag: 'Bond',
        nodes: [{
            id: '151595df1da54735b26347e8e68468d2',
            data: {
                label: 'speed',
                nodeType: NodeType.Kafka,
                description: 'used to link'
            },
            type: 'gnomon',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            id: '9a7376d3f97f4549911eb2721a9fe380',
            data: {
                label: 'real time application',
                nodeType: NodeType.Flink,
            },
            type: 'gnomon',
            position: {
                x: 100,
                y: 100
            }
        }],
        edges: [{
            id: 'edge-151595df1da54735b26347e8e68468d2-9a7376d3f97f4549911eb2721a9fe380',
            target: '151595df1da54735b26347e8e68468d2',
            source: '9a7376d3f97f4549911eb2721a9fe380',
            label: 'real time consumer',
            type: 'gnomon'
        }]
    },
    {
        id: '2',
        team: '2',
        name: 'AMM',
        tag: 'Bond',
        nodes: [{
            id: '151595df1da54735b26347e8e68468d2',
            data: {
                label: 'speed',
                nodeType: NodeType.Kafka,
                description: 'used to link'
            },
            type: 'gnomon',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            id: '9a7376d3f97f4549911eb2721a9fe380',
            data: {
                label: 'real time application',
                nodeType: NodeType.Flink,
            },
            type: 'gnomon',
            position: {
                x: 100,
                y: 100
            }
        }],
        edges: [{
            id: 'edge-151595df1da54735b26347e8e68468d2-9a7376d3f97f4549911eb2721a9fe380',
            target: '151595df1da54735b26347e8e68468d2',
            source: '9a7376d3f97f4549911eb2721a9fe380',
            label: 'real time consumer',
            type: 'gnomon'
        }]
    }]
}





export const flowApi = {
    addFlow: (flow: Flow) => {
        db.flows.push(flow)
    },
    findFlowById: (teamId: string, id: string) => {
        return db.flows.find(f => f.team === teamId && f.id === id);
    },
    findFlowByName: (teamId: string, name: string) => {
        return db.flows.find(f => f.team === teamId && f.name === name);
    },
    findFlowByTeamId: (teamId: string) => {
        return db.flows.filter(f => f.team === teamId);
    },
    updateFlow: (flow: Flow) => {
        db.flows = [...db.flows.filter(f => f.id !== flow.id), flow]
    },
    findAll: () => {
        return db.flows;
    }
}

export const teamApi = {
    addTeam: (team: Team) => {
        db.teams.push(team);
    },
    findTeamById: (id: string) => {
        return db.teams.find(f => f.id === id);
    },
    updateTeam: (team: Team) => {
        const found = db.teams.find(team => team.id === team.id);
        if (found) {
            db.teams = [...db.teams.filter(team => team.id !== found.id), team]
        }
    },
    findAll: () => {
        return db.teams;
    }
}