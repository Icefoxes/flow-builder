import { ObjectId } from "mongodb";

import { HttpException } from "../exceptions/HttpException";
import flowModel, { Flow } from "../models/flow.model";
import teamModel from "../models/team.model";

class FlowService {
    public async getFlows(): Promise<Flow[]> {
        return await flowModel.find().select("_id name tag teamId alias").exec();
    }

    public async getFlowByAlias(alias: string): Promise<Flow | null> {
        return flowModel.findOne({ alias: alias }).exec();
    }

    public async getFlowById(flowId: string): Promise<Flow | null> {
        return flowModel.findById(new ObjectId(flowId)).exec();
    }

    public async searchNode(text: string): Promise<Flow[]> {
        return flowModel.aggregate([
            { $match: { nodes: { $elemMatch: { 'data.label': { $regex: text } } } } },
            { $unwind: "$nodes" },
            { $match: { 'nodes.data.label': { $regex: text } } },
            { $project: { flowId: '$_id', flowName: '$name', nodeId: "$nodes.id", nodeName: '$nodes.data.label', nodeType: '$nodes.data.nodeType', alias: '$alias', _id: 0 } },
            { $limit: 5 }
        ]).exec();
    }

    public async createFlow(flow: Flow): Promise<Flow> {
        const findFlow = await flowModel.findOne({ alias: flow.alias }).exec();
        if (findFlow) throw new HttpException(400, `flow alias ${findFlow.alias} already exist`);

        const findTeam = await teamModel.findById(new ObjectId(flow.teamId)).exec();
        if (!!!findTeam) throw new HttpException(400, `flow team id ${flow.teamId} not exist`);

        return await flowModel.create(flow);
    }

    public async UpdateFlow(flowId: string, flow: Flow): Promise<Flow> {
        const findFlow = await flowModel.findOne({ alias: flow.alias }).exec();
        if (findFlow && findFlow.id != new ObjectId(flowId)) throw new HttpException(409, `flow alias ${findFlow.name} already exist`);

        const findTeam = await teamModel.findById(new ObjectId(flow.teamId)).exec();
        if (!!!findTeam) throw new HttpException(400, `flow team id ${flow.teamId} not exist`);

        const updatedFlow = await flowModel.findByIdAndUpdate(new ObjectId(flowId), flow, { new: true }).exec();
        if (!updatedFlow) throw new HttpException(409, "Flow doesn't exist");

        return updatedFlow;
    }

    public async DeleteFlow(flowId: string): Promise<string> {
        const flowTobeDeleted = await flowModel.findByIdAndDelete(new ObjectId(flowId)).exec();;
        if (!flowTobeDeleted) throw new HttpException(409, "Flow doesn't exist");

        return flowTobeDeleted.id;
    }
}

export default FlowService;