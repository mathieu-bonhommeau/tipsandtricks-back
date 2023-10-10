import {NextFunction, Request, Response} from 'express';
import InputLoginUser from '../../domain/models/inputLoginUser';
import AuthUserUseCase from '../../domain/use_cases/authUserUseCase';
import {JwtToken, UserLogged} from "../../domain/models/User";

export default class AuthController {
    constructor(
        private readonly _authUserUseCase: AuthUserUseCase,
    ) {}

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const inputLoginUser = new InputLoginUser(req.body.email, req.body.password);
            const data = await this._authUserUseCase.login(inputLoginUser) as UserLogged;

            const today = new Date()

            res.cookie("accessToken", data.tokens.access_token, {
                httpOnly: true,
                sameSite: true,
                expires: new Date(today.setHours(today.getHours() + 24))
            })
            res.cookie("refreshToken", data.tokens.refresh_token, {
                httpOnly: true,
                sameSite: true,
                expires: new Date(today.setMonth(today.getMonth() + 1))
            })

            return res.status(200).send({
                data: data.user,
            });
        } catch (err) {
            next(err)
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const tokens: JwtToken = await this._authUserUseCase.refreshToken(req.body.refreshToken)

            const today = new Date()

            res.cookie("accessToken", tokens.access_token, {
                httpOnly: true,
                sameSite: true,
                expires: new Date(today.setHours(today.getHours() + 24))
            })

            res.cookie("refreshToken", tokens.refresh_token, {
                httpOnly: true,
                sameSite: true,
                expires: new Date(today.setMonth(today.getMonth() + 1))
            })

            return res.status(200).send({
                data: 'Tokens regenerate with success'
            })

        } catch (err) {
            next(err)
        }
    }
}
