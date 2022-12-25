import App from './app';
import validateEnv from './utils/validateEnv';
import FlowsRoute from './routes/flow.route';
import MetasRoute from './routes/meta.route';
import TeamsRoute from './routes/team.route';


validateEnv();

const app = new App([new TeamsRoute(), new FlowsRoute(), new MetasRoute()]);

app.listen();
