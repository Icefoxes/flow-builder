import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { createValidationException } from "../exceptions/HttpException";
import MetaService from "../services/meta.service";
import { NodeTypeMeta } from "../models/meta.model";

class MetaController {
  public metaService = new MetaService();

  public getMetas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metas = await this.metaService.getMetas();
      res.json(metas);
    } catch (error) {
      next(error);
    }
  };

  public createMeta = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const meta: NodeTypeMeta = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw createValidationException(errors);

      const createdMeta = await this.metaService.createMeta(meta);
      res.status(201).json(createdMeta);
    } catch (error) {
      next(error);
    }
  };

  public updateMeta = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const metaId = req.params.metaId as string;
    const meta: NodeTypeMeta = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw createValidationException(errors);

      const updatedMeta = await this.metaService.UpdateMeta(metaId, meta);
      res.json(updatedMeta);
    } catch (error) {
      next(error);
    }
  };

  public deleteMeta = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const metaId = req.params.metaId as string;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw createValidationException(errors);

      const deletedMetaId = await this.metaService.DeleteMeta(metaId);
      res.json(deletedMetaId);
    } catch (error) {
      next(error);
    }
  };
}

export default MetaController;
