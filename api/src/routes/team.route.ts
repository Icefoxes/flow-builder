import { Router } from "express";
import { body, param } from "express-validator";

import TeamController from "../controllers/team.controller";
import { RoutesMap } from "../core/routes";

class TeamsRoute implements RoutesMap {
  public path = "/api/v1/teams";
  public router = Router();
  public teamController = new TeamController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.teamController.getTeams);

    this.router.get(
      `${this.path}/:teamId`,
      param("teamId").notEmpty(),
      this.teamController.getTeamById
    );

    this.router.post(
      `${this.path}`,
      body(["name", "description"]).notEmpty(),
      this.teamController.createTeam
    );

    this.router.put(
      `${this.path}/:teamId`,
      body(["name", "description"]).notEmpty(),
      param("teamId").notEmpty(),
      this.teamController.updateTeam
    );

    this.router.delete(
      `${this.path}/:teamId`,
      param("teamId").notEmpty(),
      this.teamController.deleteTeam
    );
  }
}

export default TeamsRoute;
