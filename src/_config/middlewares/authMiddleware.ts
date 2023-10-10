import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import AuthError from '../../_common/domain/models/authError';
import { Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { RequestLogged } from '../../_common/client-side/types/requestLogged';

dotenv.config();

export default class AuthMiddleware {
    authorize(tokenName: string): (request: RequestLogged, response: Response, next: NextFunction) => void {
        return (request: RequestLogged, _: Response, next: NextFunction) => {
            const authCookies = request.cookies;

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
                    return next();
                }
            }

            const error = new AuthError('Unauthorized');
            next(error);
        };
    }
}
