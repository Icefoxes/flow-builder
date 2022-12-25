import { Router } from "express";
import { query } from "express-validator";

import TeamController from "../controllers/team.controller";
import { RoutesMap } from "../core/routes";


class OverviewRoute implements RoutesMap {
    public path = '/api/v1/overview';
    public router = Router();
    public teamController = new TeamController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`,
            query('teamId').notEmpty(),
            this.teamController.getTeamOverview);
    }
}

export default OverviewRoute;
