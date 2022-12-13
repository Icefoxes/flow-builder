import express, { Request, Response } from 'express';
import { flowApi } from '../config';
import { Flow } from '../model';

const flowRoute = express.Router();

flowRoute.get('/', (req: Request, res: Response) => {
    flowApi.findAll().then(rlt => {
        res.json(rlt);
    })
});

flowRoute.post('/', (req: Request, res: Response) => {
    const flow = req.body as Flow;
    if (flow) {
        flowApi.addFlow(flow).then(rlt => {
            res.json(Object.assign({}, flow, {
                _id: rlt.insertedId
            }))
        })
    }
});



export { flowRoute };