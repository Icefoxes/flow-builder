import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    MONGODB_URL: str(),
    PORT: port(),
  });
};

export default validateEnv;
