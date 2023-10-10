import { NextFunction, Response } from 'express';
import InputLoginUser from '../../domain/models/inputLoginUser';
import AuthUserUseCase from '../../domain/use_cases/authUserUseCase';
import { JwtToken, UserLogged } from '../../domain/models/User';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import * as dotenv from 'dotenv';
dotenv.config();

export default class AuthController {
    constructor(private readonly _authUserUseCase: AuthUserUseCase) {}

    public async login(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const inputLoginUser = new InputLoginUser(req.body.email, req.body.password);
            const data = (await this._authUserUseCase.login(inputLoginUser)) as UserLogged;

            const today = new Date();

            res.cookie('ACCESS_TOKEN', `${data.tokens.access_token}`, {
                httpOnly: true,
                sameSite: true,
                secure: process.env.ENVIRONNMENT === 'production',
                expires: new Date(today.setHours(today.getHours() + 24)),
            });
            res.cookie('REFRESH_TOKEN', `${data.tokens.refresh_token}`, {
                httpOnly: true,
                sameSite: true,
                secure: process.env.ENVIRONNMENT === 'production',
                expires: new Date(today.setMonth(today.getMonth() + 1)),
                path: '/api/refresh-token',
            });

            return res.status(200).send({
                data: data.user,
            });
        } catch (err) {
            next(err);
        }
    }

    public async refreshToken(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const tokens: JwtToken = await this._authUserUseCase.refreshToken(req.email);

            const today = new Date();

            res.cookie('ACCESS_TOKEN', `${tokens.access_token}`, {
                httpOnly: true,
                sameSite: true,
                secure: process.env.ENVIRONNMENT === 'production',
                expires: new Date(today.setHours(today.getHours() + 24)),
            });

            res.cookie('REFRESH_TOKEN', `${tokens.refresh_token}`, {
                httpOnly: true,
                sameSite: true,
                secure: process.env.ENVIRONNMENT === 'production',
                expires: new Date(today.setMonth(today.getMonth() + 1)),
                path: '/api/refresh-token',
            });

            return res.status(200).send({
                data: 'Tokens regenerate with success',
            });
        } catch (err) {
            next(err);
        }
    }
}
