import { Request, Response } from 'express';
import RegisterUserUseCase from '../../domain/use_cases/registerUserUseCase';
import InputUserData from '../../domain/models/inputUserData';
import InputError from '../../../_common/domain/models/inputError';

export default class UserController {
    constructor(private readonly _registerUserUseCase: RegisterUserUseCase) {}
    public async register(req: Request, res: Response) {
        const inputUserData = new InputUserData(req.body.email, req.body.username, req.body.password);
        const data = await this._registerUserUseCase.register(inputUserData);

        if (data instanceof InputError) {
            return res.status(400).send({
                data: data.message,
            });
        }
        return res.status(201).send({
            data: data,
        });
    }
}
