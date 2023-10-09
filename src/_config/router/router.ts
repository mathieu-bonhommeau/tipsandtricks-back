import { Request, Response, Router } from 'express';
import UserController from '../../user/client-side/controllers/userController';
import RegisterUserUseCase from '../../user/domain/use_cases/registerUserUseCase';
import dependencyContainer from '../dependencies/dependencies';
import AuthUserUseCase from "../../user/domain/use_cases/authUserUseCase";

const router = Router();

router.get('/test', (_, res) => {
    res.send('Express running on test route !');
});
router.post('/api/register', async (req: Request, res: Response) => {
    return await new UserController(
        dependencyContainer.get<RegisterUserUseCase>('RegisterUserUseCase'),
        dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')
    ).register(
        req,
        res,
    );
});

export default router;
