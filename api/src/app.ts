import express, { Router } from "express";
// standard
import path from "path";
// middleware
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import BodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware";
// database
import { connect, set } from "mongoose";
import { dbConnection } from "./databases";
// swagger
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// conf
import { NODE_ENV, PORT } from "./config";
// utils
import { logger } from "./utils/logger";
import { RoutesMap } from "./core/routes";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: RoutesMap[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 8080;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== "production") {
      set("debug", true);
    }

    connect(dbConnection.url, dbConnection.options);
  }

  private initializeMiddlewares() {
    this.app.use("/", express.static(path.join(__dirname, "public")));
    this.app.use(compression());
    this.app.use(morgan("combined"));
    this.app.use(cors());
    this.app.use(BodyParser.urlencoded({ extended: false }));
    this.app.use(BodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: { path: string; router: Router }[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: "REST API",
          version: "1.0.0",
          description: "Example docs",
        },
      },
      apis: ["./controllers/*.js"],
    };

    const specs = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
