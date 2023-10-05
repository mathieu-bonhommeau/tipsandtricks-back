import express from 'express';
import * as dotenv from 'dotenv';
import router from './_config/router/router';
dotenv.config();

const app = express();
const port = process.env.NODE_PORT || 5000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
