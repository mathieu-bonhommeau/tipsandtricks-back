import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import AuthError from "../../_common/domain/models/authError";
dotenv.config();

export default class AuthMiddleware {
    authorize(): (request: Request, response: Response, next: NextFunction) => void {
        return (request: Request, response: Response, next: NextFunction) => {
            const authHeader = request.headers.authorization
            if (authHeader) {
                const token = authHeader.split('Bearer ')[1]
                const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS || 'access_secret')
                return next(decoded)
            }
            const error = new AuthError('Unauthorized')
            next(error)
        }
    }
}