import { NextFunction, Response } from 'express';
import InputLoginUser from '../../domain/models/inputLoginUser';
import AuthUserUseCase from '../../domain/use_cases/authUserUseCase';
import { JwtToken, UserLogged } from '../../domain/models/User';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import * as dotenv from 'dotenv';
dotenv.config();

export default class AuthController {
    constructor(private readonly _authUserUseCase: AuthUserUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: User
     *   description: Login a user
     * /login:
     *   post:
     *     summary: Login a user
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InputLoginUser'
     *     responses:
     *       200:
     *         description: the logged user and .
     *         headers:
     *             Set-Cookie:
     *               schema:
     *                 type: string
     *                 example:
     *                   ACCESS_TOKEN=abcde12345; Path=/; HttpOnly;
     *                   REFRESH_TOKEN=abcde12345; Path=/; HttpOnly;
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server error
     *
     */
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

    /**
     * @openapi
     * tags:
     *   name: User
     *   description: Refresh user tokens
     * /refresh-token:
     *   get:
     *     summary: Refresh tokens
     *     tags: [User]
     *     security:
     *         - cookieAuth: [
     *             REFRESH_TOKEN=abcde12345; Path=/; HttpOnly;
     *         ]
     *
     *     responses:
     *       200:
     *         description: the logged user and .
     *         headers:
     *             Set-Cookie:
     *               schema:
     *                 type: string
     *                 example:
     *                   ACCESS_TOKEN=abcde12345; Path=/; HttpOnly;
     *                   REFRESH_TOKEN=abcde12345; Path=/; HttpOnly;
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server error
     *
     */
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

    /**
     * @openapi
     * tags:
     *   name: User
     *   description: Logout
     * /logout:
     *   post:
     *     summary: Logout a user
     *     tags: [User]
     *     responses:
     *       200:
     *         description: logout success - delete cookie ACCESS_TOKEN
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server error
     *
     */
    public async logout(_: RequestLogged, res: Response, next: NextFunction){
        try {
            res.clearCookie("ACCESS_TOKEN")
            res.end()

        } catch (err) {
            next(err)
        }
    }
}
