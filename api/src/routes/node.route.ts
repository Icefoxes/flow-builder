import { Router } from "express";
import { query } from "express-validator";

import { RoutesMap } from "../core/routes";
import NodeController from "../controllers/node.controller";

class NodesRoute implements RoutesMap {
  public path = "/api/v1/nodes";
  public router = Router();
  public nodeController = new NodeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/search`,
      query("q").notEmpty(),
      this.nodeController.searchNode
    );
  }
}

export default NodesRoute;
