import { Router } from "express";

export interface RoutesMap {
  path: string;
  router: Router;
}
