import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { isEmpty } from 'lodash';
import { RequestLogged } from '../types/requestLogged';
import AuthError from '../../domain/errors/authError';
import dependencyContainer from '../../../_dependencyContainer/dependencyContainer';
import AuthUserUseCase from '../../../user/domain/use_cases/authUserUseCase';

dotenv.config();

export default class AuthMiddleware {
    authorize(tokenName: string): (request: RequestLogged, response: Response, next: NextFunction) => void {
        return async (request: RequestLogged, _: Response, next: NextFunction) => {
            const authCookies = request.cookies;
            if (!isEmpty(authCookies)) {
                switch (tokenName) {
                    case 'ACCESS_TOKEN': {
                        const decodedAccess = jwt.verify(
                            authCookies['ACCESS_TOKEN'],
                            process.env.JWT_SECRET_ACCESS || 'access_secret',
                        ) as JwtPayload;
                        if (decodedAccess) request.user = decodedAccess.data;
                        return next();
                    }
                    case 'REFRESH_TOKEN': {
                        const decodedRefresh = jwt.verify(
                            authCookies['REFRESH_TOKEN'],
                            process.env.JWT_SECRET_REFRESH || 'refresh_secret',
                        ) as JwtPayload;
                        if (decodedRefresh) request.email = decodedRefresh.data;
                        const isValid = await dependencyContainer
                            .get<AuthUserUseCase>('AuthUserUseCase')
                            .checkRefreshToken(request.email, authCookies['REFRESH_TOKEN']);
                        if (!isValid) {
                            const error = new AuthError('Invalid refresh_token');
                            next(error);
                        }

                        return next();
                    }
                    default: {
                        const error = new AuthError('Unauthorized');
                        return next(error);
                    }
                }
            }
            const error = new AuthError('Unauthorized');
            next(error);
        };
    }
}