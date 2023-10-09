import { Request, Response, Router } from 'express';
import cors from 'cors'
import UserController from '../../user/client-side/controllers/userController';
import RegisterUserUseCase from '../../user/domain/use_cases/registerUserUseCase';
import dependencyContainer from '../dependencies/dependencies';
import AuthUserUseCase from "../../user/domain/use_cases/authUserUseCase";

const corsOptions = {
    origin: process.env.WEBAPP_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200,
    allowedHeaders: [
        'access-control-allow-origin',
        'authorization',
    ],
}

const router = Router();

router.get('/test', (_, res) => {
    res.send('Express running on test route !');
});
router.post('/api/register', cors(corsOptions), async (req: Request, res: Response) => {
    return await new UserController(
        dependencyContainer.get<RegisterUserUseCase>('RegisterUserUseCase'),
        dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')
    ).register(
        req,
        res,
    );
});

export default router;
