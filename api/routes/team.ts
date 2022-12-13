import express, { Request, Response } from 'express';
import { flowApi, teamApi } from '../config';
import { Flow } from '../model';
import { Team } from '../model/team.model';

const teamRoute = express.Router();

teamRoute.get('/', (req: Request, res: Response) => {
    teamApi.findAll().then(rlt => {
        res.json(rlt);
    })
});

teamRoute.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (id) {
        teamApi.findTeamById(id).then(rlt => {
            res.json(rlt)
        });
    } else {
        res.status(404);
    }
});

teamRoute.post('/', (req: Request, res: Response) => {
    const team = req.body as Team;
    if (team) {
        teamApi.addTeam(team).then(rlt => {
            res.json(Object.assign({}, team, {
                _id: rlt.insertedId
            }));
        })
    }
});

teamRoute.patch('/', (req: Request, res: Response) => {
    const team = req.body as Team;
    if (team) {
        teamApi.updateTeam(team).then(rlt => {
            if (rlt.modifiedCount === 1) {
                return res.json(team);
            }
        })
    } else {
        res.sendStatus(404);
    }
});

// Flows
teamRoute.get('/:id/flows', (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (id) {
        flowApi.findFlowByTeamId(id).then(rlt => {
            res.json(rlt);
        })
    } else {
        res.status(404);
    }
});


teamRoute.get('/:id/flows/:flowId', (req: Request, res: Response) => {
    const id = req.params.id as string;
    const flowId = req.params.flowId as string;
    if (id && flowId) {
        flowApi.findFlowById(id, flowId).then(rlt => {
            res.json(rlt);
        })
    } else {
        res.status(404);
    }
});

teamRoute.patch('/:id/flows/:flowId', (req: Request, res: Response) => {
    const flow = req.body as Flow;
    if (flow) {
        flowApi.updateFlow(flow).then(rlt => {
            if (rlt.modifiedCount === 1) {
                res.json(flow);
            }
        })
    } else {
        res.sendStatus(404);
    }
});






export { teamRoute };