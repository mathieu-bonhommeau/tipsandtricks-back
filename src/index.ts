import express from 'express';
import cors from 'cors'
import * as dotenv from 'dotenv';
import router from './_config/router/router';
dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.WEBAPP_URL || 'http://localhost:3000',
}
app.use(cors(corsOptions))

const port = process.env.NODE_PORT || 5000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
