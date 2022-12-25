import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import FlowService from "../services/flow.service";
import { createValidationException, HttpException } from "../exceptions/HttpException";
import { Flow } from "../models/flow.model";


class FlowController {
    public flowService = new FlowService();

    public getFlows = async (req: Request, res: Response, next: NextFunction) => {
        const alias = req.query.alias as string;
        try {
            if (alias) {
                const flow = await this.flowService.getFlowByAlias(alias);
                if (!flow) throw new HttpException(404, `${alias} not found`);
                res.json(flow);
                return;
            }
            const flows = await this.flowService.getFlows();
            res.json(flows);
        } catch (error) {
            next(error);
        }
    }

    public getFlowById = async (req: Request, res: Response, next: NextFunction) => {
        const flowId = req.params.flowId as string;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw createValidationException(errors);

            const flow = await this.flowService.getFlowById(flowId);
            if (!flow) throw new HttpException(404, `${flowId} not found`);
            
            res.json(flow);
            return;

        } catch (error) {
            next(error);
        }
    }

    public createFlow = async (req: Request, res: Response, next: NextFunction) => {
        const flow: Flow = req.body;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw createValidationException(errors);

            const createdTeam = await this.flowService.createFlow(flow);
            res.status(201).json(createdTeam);
        } catch (error) {
            next(error);
        }
    }

    public updateFlow = async (req: Request, res: Response, next: NextFunction) => {
        const flowId = req.params.flowId as string;
        const flow: Flow = req.body;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw createValidationException(errors);

            const updatedFlow = await this.flowService.UpdateFlow(flowId, flow);
            res.json(updatedFlow);
        } catch (error) {
            next(error);
        }
    }

    public deleteFlow = async (req: Request, res: Response, next: NextFunction) => {
        const flowId = req.params.flowId as string;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw createValidationException(errors);

            const deletedFlowId = await this.flowService.DeleteFlow(flowId);
            res.json(deletedFlowId);
        } catch (error) {
            next(error);
        }
    }
}

export default FlowController;
