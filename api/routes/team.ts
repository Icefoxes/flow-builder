import express, { Request, Response } from 'express';
import { flowApi, teamApi } from '../config';
import { Team } from '../model/team.model';

const teamRoute = express.Router();

teamRoute.get('/', (req: Request, res: Response) => {
    teamApi.findAll().then(rlt => {
        res.json(rlt);
    })
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
    const body = Object.assign({}, team)
    if (team) {
        teamApi.updateTeam(team).then(rlt => {
            if (rlt.acknowledged && rlt.modifiedCount === 1) {
                res.json(body);
            } else {
                res.status(500);
            }
        })

    } else {
        res.status(404);
    }
});

teamRoute.delete('/', (req: Request, res: Response) => {
    const team = req.body as Team;
    if (team) {
        teamApi.deleteTeam(team).then(rlt => {
            if (rlt.acknowledged) {
                res.json(team);
            } else {
                res.status(500);
            }
        })

    } else {
        res.status(404);
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

export { teamRoute };