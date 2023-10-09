import {NextFunction, Request, Response, Router} from 'express';
import RegisterUserUseCase from '../../user/domain/use_cases/registerUserUseCase';
import dependencyContainer from '../dependencies/dependencies';
import AuthUserUseCase from '../../user/domain/use_cases/authUserUseCase';
import RegisterController from "../../user/client-side/controllers/registerController";
import AuthController from "../../user/client-side/controllers/authController";
import AuthMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get('/test', (_, res) => {
    res.send('Express running on test route !');
});

router.get('/isConnect', new AuthMiddleware().authorize(), (_, res, next: NextFunction) => {
    res.send('You are connect !');
});

router.post('/api/register', async (req: Request, res: Response, next: NextFunction) => {
    return await new RegisterController(
        dependencyContainer.get<RegisterUserUseCase>('RegisterUserUseCase'),
    ).register(req, res, next);
});

router.post('/api/login', async (req: Request, res: Response, next: NextFunction) => {
    return await new AuthController(
        dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase'),
    ).login(req, res, next);
});

export default router;
