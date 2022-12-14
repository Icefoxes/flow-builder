import express, { Request, Response } from 'express';
import { flowApi } from '../config';
import { Flow } from '../model';

const flowRoute = express.Router();

flowRoute.get('/', (req: Request, res: Response) => {
    flowApi.findAll().then(rlt => {
        res.json(rlt);
    })
});

flowRoute.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (id) {
        flowApi.findFlowById(id).then(rlt => {
            res.json(rlt);
        })
    } else {
        res.status(404);
    }
});

flowRoute.post('/', (req: Request, res: Response) => {
    const flow = req.body as Flow;
    if (flow) {
        flowApi.addFlow(flow).then(rlt => {
            res.status(201).json(Object.assign({}, flow, {
                _id: rlt.insertedId
            }))
        })
    }
});

flowRoute.patch('/', (req: Request, res: Response) => {
    const flow = req.body as Flow;
    if (flow) {
        flowApi.updateFlow(flow).then(rlt => {
            if (rlt.acknowledged) {
                res.json(flow);
            } else {
                res.status(500);
            }
        })
    } else {
        res.status(404);
    }
});

flowRoute.delete('/', (req: Request, res: Response) => {
    const flow = req.body as Flow;
    if (flow) {
        flowApi.deleteFlow(flow).then(rlt => {
            if (rlt.acknowledged) {
                return res.json(flow);
            }
        })
    }
    return res.status(500);
});

export { flowRoute };