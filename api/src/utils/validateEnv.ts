import { cleanEnv, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    MONGODB_URL: str(),
  });
};

export default validateEnv;
