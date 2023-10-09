import {NextFunction, Request, Response} from "express";
import ErrorsHandler from "../../_handlers/errorsHandler";

export const errorsMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorsHandler.handle(err, req, res)
};