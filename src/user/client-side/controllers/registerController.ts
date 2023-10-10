import { NextFunction, Response } from 'express';
import RegisterUserUseCase from '../../domain/use_cases/registerUserUseCase';
import InputRegisterUser from '../../domain/models/inputRegisterUser';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';

export default class RegisterController {
    constructor(private readonly _registerUserUseCase: RegisterUserUseCase) {}
    public async register(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const inputRegisterUser = new InputRegisterUser(req.body.email, req.body.username, req.body.password);
            const data = await this._registerUserUseCase.register(inputRegisterUser);
            return res.status(201).send({
                data: data,
            });
        } catch (err) {
            next(err);
        }
    }
}
