import { Router } from "express";
import { body, param } from "express-validator";

import { RoutesMap } from "../core/routes";
import FlowController from "../controllers/flow.controller";

class FlowsRoute implements RoutesMap {
  public path = "/api/v1/flows";
  public router = Router();
  public flowController = new FlowController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.flowController.getFlows);

    this.router.get(
      `${this.path}/:flowId`,
      param("flowId").notEmpty({ ignore_whitespace: true }),
      this.flowController.getFlowById
    );

    this.router.post(
      `${this.path}`,
      body(["alias", "name", "teamId"]).notEmpty({ ignore_whitespace: true }),
      body(["nodes", "edges", "extensions"]).exists(),
      this.flowController.createFlow
    );

    this.router.put(
      `${this.path}/:flowId`,
      param("flowId").notEmpty({ ignore_whitespace: true }),
      body(["alias", "name", "teamId"]).notEmpty({ ignore_whitespace: true }),
      body(["nodes", "edges", "extensions"]).exists(),
      this.flowController.updateFlow
    );

    this.router.delete(
      `${this.path}/:flowId`,
      param("flowId").notEmpty({ ignore_whitespace: true }),
      this.flowController.deleteFlow
    );
  }
}

export default FlowsRoute;
