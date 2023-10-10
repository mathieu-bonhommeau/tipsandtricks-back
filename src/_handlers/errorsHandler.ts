import debug from "debug"
import { Request, Response } from 'express';
const logger = debug("tipsandtricks:errorsHandler")

export default class ErrorsHandler {
    static handle(err: Error, req: Request, res: Response) {
        if (err['statusCode']) {
            res.status(err['statusCode']).send({
                status: err['statusCode'],
                message: err.message
            });
            logger(err.message)
            logger(err.stack)
            return;
        }
        logger(err.message)
        logger(err.stack)
        res.status(500).send({
            status: err['statusCode'],
            message: "Server error"
        });
    }
}
