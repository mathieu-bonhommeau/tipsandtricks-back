import { NextFunction, Response, Router } from 'express';
import RegisterUserUseCase from '../../user/domain/use_cases/registerUserUseCase';
import ListTipsUseCase from '../../tips/domain/use_cases/listTipsUseCase';
import dependencyContainer from '../dependencies/dependencies';
import AuthUserUseCase from '../../user/domain/use_cases/authUserUseCase';
import RegisterController from '../../user/client-side/controllers/registerController';
import AuthController from '../../user/client-side/controllers/authController';
import { RequestLogged } from '../../_common/client-side/types/requestLogged';
import AuthMiddleware from '../../_common/client-side/middlewares/authMiddleware';
import ListTipsController from '../../tips/client-side/controllers/listTipsController';
import CreateTipsUseCase from '../../tips/domain/use_cases/createTipsUseCase';
import createTipsController from '../../tips/client-side/controllers/createTipsController';
import updateTipsController from '../../tips/client-side/controllers/updateTipsController';
import UpdateTipsUseCase from '../../tips/domain/use_cases/updateTipsUseCase';

const router = Router();

router.get('/test', (_, res) => {
    res.send('Express running on test route !');
});

router.get('/isConnected', new AuthMiddleware().authorize('ACCESS_TOKEN'), (_, res) => {
    res.send('Express running on test route !');
});

router.get('/api/reconnect', async (req: RequestLogged, res: Response, next: NextFunction) => {
    return await new AuthController(dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')).reconnect(
        req,
        res,
        next,
    );
});

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

router.get(
    '/api/tips',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new ListTipsController(dependencyContainer.get<ListTipsUseCase>('ListTipsUseCase')).tipsList(
            req,
            res,
            next,
        );
    },
);

router.post(
    '/api/tips',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new createTipsController(dependencyContainer.get<CreateTipsUseCase>('CreateTipsUseCase')).create(
            req,
            res,
            next,
        );
    },
);

router.put(
    '/api/tips/:tipsId',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new updateTipsController(dependencyContainer.get<UpdateTipsUseCase>('UpdateTipsUseCase')).update(
            req,
            res,
            next,
        );
    },
);

export default router;
