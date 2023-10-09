import { Request, Response } from 'express';

export default class ErrorsHandler {
    static handle(err: Error, req: Request, res: Response) {
        if (err['statusCode']) {
            res.status(err['statusCode']).send({
                status: err['statusCode'],
                message: err.message
            });
            console.error(err.message);
            return;
        }
        console.error(err.message);
        res.status(500).send({
            status: err['statusCode'],
            message: "Server error"
        });
    }
}
