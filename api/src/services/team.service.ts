import { ObjectId } from "mongodb";

import { HttpException } from "../exceptions/HttpException";
import teamModel, { Team } from "../models/team.model";
import flowModel from "../models/flow.model";

class TeamService {
    public async getTeams(): Promise<Team[]> {
        return teamModel.find().exec();
    }

    public async getTeamById(teamId: string): Promise<Team | null> {
        return teamModel.findById(new ObjectId(teamId)).exec();
    }

    public async getTeamOverview(teamId: string) {
        return await flowModel.aggregate([
            { $match: { teamId: new ObjectId(teamId) } },
            { $unwind: "$nodes" },
            { $project: { name: "$nodes.data.label", type: "$nodes.data.nodeType" } },
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]).exec();
    }

    public async createTeam(team: Team): Promise<Team> {
        const findTeam = await teamModel.findOne({ name: team.name }).exec();
        if (findTeam) throw new HttpException(400, `team name ${findTeam.name} already exist`);

        return teamModel.create(team);
    }

    public async UpdateTeam(teamId: string, team: Team): Promise<Team> {
        const findTeam = await teamModel.findOne({ name: team.name }).exec();
        if (findTeam && findTeam.id != new ObjectId(teamId)) throw new HttpException(409, `team name ${findTeam.name} already exist`);

        const updatedTeam = await teamModel.findByIdAndUpdate(new ObjectId(teamId), team, { new: true }).exec();
        if (!updatedTeam) throw new HttpException(409, "Team doesn't exist");

        return updatedTeam;
    }

    public async DeleteTeam(teamId: string): Promise<string> {
        const teamTobeDeleted = await teamModel.findByIdAndDelete(new ObjectId(teamId)).exec();
        if (!teamTobeDeleted) throw new HttpException(409, "Team doesn't exist");

        return teamTobeDeleted.id;
    }
}

export default TeamService;