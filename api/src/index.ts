import App from "./app";
import validateEnv from "./utils/validateEnv";
import FlowsRoute from "./routes/flow.route";
import MetasRoute from "./routes/meta.route";
import TeamsRoute from "./routes/team.route";
import OverviewRoute from "./routes/overview.route";
import NodesRoute from "./routes/node.route";

validateEnv();

const app = new App([
  new TeamsRoute(),
  new FlowsRoute(),
  new MetasRoute(),
  new OverviewRoute(),
  new NodesRoute(),
]);

app.listen();
