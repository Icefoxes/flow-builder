import express, { Request, Response } from 'express';
import { flowApi, teamApi } from '../config';
import { Flow } from '../model';
import { Team } from '../model/team.model';

const teamRoute = express.Router();

teamRoute.get('/', (req: Request, res: Response) => {
    res.json(teamApi.findAll());
});

teamRoute.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (id) {
        const team = teamApi.findTeamById(id);
        if (team) {
            res.json(team);
            return;
        }
        res.status(404);
    } else {
        res.status(404);
    }
});

teamRoute.get('/:id/flows/:flowId', (req: Request, res: Response) => {
    const id = req.params.id as string;
    const flowId = req.params.flowId as string;
    if (id && flowId) {
        const flow = flowApi.findFlowById(id, flowId);
        if (flow) {
            res.json(flow);
            return;
        }
        res.status(404);
    } else {
        res.status(404);
    }
});

teamRoute.patch('/:id/flows/:flowId', (req: Request, res: Response) => {
    const flow = req.body as Flow;
    if (flow) {
        flowApi.updateFlow(flow);
        res.json(flow);
    } else {
        res.sendStatus(404);
    }
});

teamRoute.get('/:id/flows', (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (id) {
        const flows = flowApi.findFlowByTeamId(id);
        if (flows) {
            res.json(flows);
            return;
        }
        res.status(404);
    } else {
        res.status(404);
    }
});


teamRoute.post('/', (req: Request, res: Response) => {
    const team = req.body as Team;
    if (team) {
        teamApi.addTeam(team);
        res.json(team);
    }
});

teamRoute.patch('/', (req: Request, res: Response) => {
    const team = req.body as Team;
    if (team) {
        teamApi.updateTeam(team);
        res.json(team);
    } else {
        res.sendStatus(404);
    }
});

export { teamRoute };