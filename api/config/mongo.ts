import { MongoClient } from 'mongodb'
import { Flow } from '../model';
import { Team } from '../model/team.model';

const url = process.env.ME_CONFIG_MONGODB_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'gnomon';

export function getDb() {
    // Use connect method to connect to the server
    client.connect();
    console.log('Connected successfully to mongodb');
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
    findFlowById: (id: string) => {
        return flows.findOne({ id });
    },
    findFlowByName: (teamId: string, name: string) => {
        return flows.findOne({ 'team': teamId, name });
    },
    findFlowByTeamId: (teamId: string) => {
        return flows.find({ 'team': teamId }).toArray();
    },
    updateFlow: (flow: Flow) => {
        delete (flow as any)['_id'];
        return flows.updateOne({ 'id': flow.id }, { $set: { ...flow } });
    },
    deleteFlow: (flow: Flow) => {
        return flows.deleteOne({ id: flow.id });
    },
    findAll: () => {
        return flows.find({}, {
            projection: {
                _id: 0,
                id: 1,
                name: 1,
                tag: 1,
                team: 1,
            }
        }).toArray();
    },
    searchNode: (text: string) => {
        return flows.aggregate([
            { $match: { nodes: { $elemMatch: { 'data.label': { $regex: text } } } } },
            { $unwind: "$nodes" },
            { $match: { 'nodes.data.label': { $regex: text } } },
            { $project: { flowId: '$id', flowName: '$name', nodeName: '$nodes.data.label', nodeType: '$nodes.data.nodeType', _id: 0 } },
            { $limit: 5 }
        ]).toArray();
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
        delete (team as any)['_id'];
        return teams.updateOne({ id: team.id }, { $set: { ...team } });
    },
    deleteTeam: (team: Team) => {
        return teams.deleteOne({ id: team.id });
    },
    findAll: () => {
        return teams.find().toArray();
    },
    getTeamOverview: (teamId: string) => {
        return flows.aggregate([
            { $match: { team: teamId } },
            { $unwind: "$nodes" },
            { $project: { name: "$nodes.data.label", type: "$nodes.data.nodeType" }, _id: 0 },
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]).toArray();
    }
}