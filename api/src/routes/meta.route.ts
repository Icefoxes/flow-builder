import { Router } from "express";
import { body, param } from "express-validator";

import { RoutesMap } from "../core/routes";
import MetaController from "../controllers/meta.controller";

class MetasRoute implements RoutesMap {
  public path = "/api/v1/metas";
  public router = Router();
  public metaController = new MetaController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.metaController.getMetas);

    this.router.post(
      `${this.path}`,
      body(["name", "icon", "functionalType"]).notEmpty(),
      body(["attributes"]).isArray(),
      this.metaController.createMeta
    );

    this.router.put(
      `${this.path}/:metaId`,
      body(["name", "icon", "functionalType"]).notEmpty(),
      body(["attributes"]).isArray(),
      param("metaId").notEmpty(),
      this.metaController.updateMeta
    );

    this.router.delete(
      `${this.path}/:metaId`,
      param("metaId").notEmpty(),
      this.metaController.deleteMeta
    );
  }
}

export default MetasRoute;
