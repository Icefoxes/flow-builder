import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import TeamService from "../services/team.service";
import { Team } from "../models/team.model";
import {
  createValidationException,
  HttpException,
} from "../exceptions/HttpException";

class TeamController {
  public teamService = new TeamService();

  public getTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teams = await this.teamService.getTeams();
      res.json(teams);
    } catch (error) {
      next(error);
    }
  };

  public getTeamOverview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const teamId = req.query.teamId as string;
    try {
      const overview = await this.teamService.getTeamOverview(teamId);
      res.json(overview);
    } catch (error) {
      next(error);
    }
  };

  public getTeamById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const teamId = req.params.teamId;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw createValidationException(errors);

      const findTeam = await this.teamService.getTeamById(teamId);
      if (!findTeam) throw new HttpException(404, `Team not found`);
      res.json(findTeam);
    } catch (error) {
      next(error);
    }
  };

  public createTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const team: Team = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw createValidationException(errors);

      const createdTeam = await this.teamService.createTeam(team);
      res.status(201).json(createdTeam);
    } catch (error) {
      next(error);
    }
  };

  public updateTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const teamId = req.params.teamId as string;
    const team: Team = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw createValidationException(errors);

      const updatedTeam = await this.teamService.UpdateTeam(teamId, team);
      res.json(updatedTeam);
    } catch (error) {
      next(error);
    }
  };

  public deleteTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const teamId = req.params.teamId as string;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw createValidationException(errors);

      const deletedTeam = await this.teamService.DeleteTeam(teamId);
      res.json(deletedTeam);
    } catch (error) {
      next(error);
    }
  };
}

export default TeamController;
