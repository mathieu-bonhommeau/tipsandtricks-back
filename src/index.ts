import express from 'express';
<<<<<<< Updated upstream
import cors from 'cors';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './_config/router/router';
import swaggerConfig from '../swagger.config';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { errorsMiddleware } from './_common/client-side/middlewares/errorsMiddleware';
import process from 'process';
dotenv.config();

const app = express();

app.use(cookieParser());

const corsOptions = {
    origin: process.env.WEBAPP_URL || 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.NODE_PORT || 5000;

app.use(express.json());

app.use(router);

app.use(errorsMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerConfig), { explorer: true }));
=======
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.NODE_PORT;
app.get('/', (_, res) => {
    res.send('Express + TypeScript Server');
});
>>>>>>> Stashed changes

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
