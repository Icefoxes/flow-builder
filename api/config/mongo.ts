import { MongoClient } from 'mongodb'
import { Flow } from '../model';
import { Team } from '../model/team.model';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'gnomon';

export function getDb() {
    // Use connect method to connect to the server
    client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    return db;
}

const db = getDb();

const flows = db.collection('flows');
const teams = db.collection('teams');

export const flowApi = {
    addFlow: (flow: Flow) => {
        return flows.insertOne(flow);
    },
    findFlowById: (teamId: string, id: string) => {
        return flows.findOne({ 'team': teamId, id });
    },
    findFlowByName: (teamId: string, name: string) => {
        return flows.findOne({ 'team': teamId, name });
    },
    findFlowByTeamId: (teamId: string) => {
        return flows.find({ 'team': teamId }).toArray();
    },
    updateFlow: (flow: Flow) => {
        return flows.updateOne({ 'id': flow.id }, flow);
    },
    findAll: () => {
        return flows.find().toArray();
    }
}

export const teamApi = {
    addTeam: (team: Team) => {
        return teams.insertOne(team);
    },
    findTeamById: (id: string) => {
        return teams.findOne({ id });
    },
    updateTeam: (team: Team) => {
        return teams.updateOne({ id: team.id }, team);
    },
    findAll: () => {
        return teams.find().toArray();
    }
}