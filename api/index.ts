import dotenv from 'dotenv';
import { createApp } from './app';


dotenv.config();

const port = process.env.PORT || 8080;
const app = createApp();

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});