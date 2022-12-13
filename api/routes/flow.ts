import express, { Request, Response } from 'express';
import { flowApi } from '../config';
import { Flow } from '../model';

const flowRoute = express.Router();

flowRoute.get('/', (req: Request, res: Response) => {
    res.json(flowApi.findAll())
});

flowRoute.post('/', (req: Request, res: Response) => {
    const flow = req.body as Flow;
    if (flow) {
        flowApi.addFlow(flow);
    }
});



export { flowRoute };