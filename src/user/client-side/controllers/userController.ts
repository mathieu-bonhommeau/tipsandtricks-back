import { Request, Response } from 'express';
import RegisterUserUseCase from '../../domain/use_cases/registerUserUseCase';
import InputRegisterUser from '../../domain/models/inputRegisterUser';
import ErrorsHandler from '../../../_handlers/errorsHandler';
import InputLoginUser from '../../domain/models/inputLoginUser';
import AuthUserUseCase from '../../domain/use_cases/authUserUseCase';

export default class UserController {
    constructor(
        private readonly _registerUserUseCase: RegisterUserUseCase,
        private readonly _authUserUseCase: AuthUserUseCase,
    ) {}
    public async register(req: Request, res: Response) {
        try {
            const inputRegisterUser = new InputRegisterUser(req.body.email, req.body.username, req.body.password);
            const data = await this._registerUserUseCase.register(inputRegisterUser);
            return res.status(201).send({
                data: data,
            });
        } catch (err) {
            ErrorsHandler.handle(err, req, res);
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const inputLoginUser = new InputLoginUser(req.body.email, req.body.password);
            const data = await this._authUserUseCase.login(inputLoginUser);
            return res.status(200).send({
                data: data,
            });
        } catch (err) {
            ErrorsHandler.handle(err, req, res);
        }
    }
}
