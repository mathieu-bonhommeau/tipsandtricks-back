import { Request, Response } from 'express';
import RegisterUserUseCase from '../../domain/use_cases/registerUserUseCase';
import InputUserData from '../../domain/models/inputUserData';
import ErrorsHandler from '../../../_handlers/errorsHandler';

export default class UserController {
    constructor(private readonly _registerUserUseCase: RegisterUserUseCase) {}
    public async register(req: Request, res: Response) {
        try {
            const inputUserData = new InputUserData(req.body.email, req.body.username, req.body.password);
            const data = await this._registerUserUseCase.register(inputUserData);
            return res.status(201).send({
                data: data,
            });
        } catch (err) {
            ErrorsHandler.handle(err, req, res);
        }
    }
}
