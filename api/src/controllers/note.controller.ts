import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import FlowService from "../services/flow.service";
import { createValidationException } from "../exceptions/HttpException";


class NodeController {
    public flowService = new FlowService();

    public searchNode = async (req: Request, res: Response, next: NextFunction) => {
        const q = req.query.q as string;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw createValidationException(errors);
            
            const flows = await this.flowService.searchNode(q);
            res.json(flows);
        } catch (error) {
            next(error);
        }
    }
}

export default NodeController;
