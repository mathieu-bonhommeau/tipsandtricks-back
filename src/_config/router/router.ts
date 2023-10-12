import { NextFunction, Response, Router } from 'express';
import RegisterUserUseCase from '../../user/domain/use_cases/registerUserUseCase';
import dependencyContainer from '../dependencies/dependencies';
import AuthUserUseCase from '../../user/domain/use_cases/authUserUseCase';
import RegisterController from '../../user/client-side/controllers/registerController';
import AuthController from '../../user/client-side/controllers/authController';
import { RequestLogged } from '../../_common/client-side/types/requestLogged';
import AuthMiddleware from '../../_common/client-side/middlewares/authMiddleware';

const router = Router();

router.get('/test', (_, res) => {
    res.send('Express running on test route !');
});

router.get(
    '/api/reconnect',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new AuthController(dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')).reconnect(
            req,
            res,
            next,
        );
    },
);

router.post('/api/register', async (req: RequestLogged, res: Response, next: NextFunction) => {
    return await new RegisterController(dependencyContainer.get<RegisterUserUseCase>('RegisterUserUseCase')).register(
        req,
        res,
        next,
    );
});

router.post('/api/login', async (req: RequestLogged, res: Response, next: NextFunction) => {
    return await new AuthController(dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')).login(req, res, next);
});

router.post(
    '/api/logout',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new AuthController(dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')).logout(
            req,
            res,
            next,
        );
    },
);

router.get(
    '/api/refresh-token',
    new AuthMiddleware().authorize('REFRESH_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new AuthController(dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')).refreshToken(
            req,
            res,
            next,
        );
    },
);

export default router;
