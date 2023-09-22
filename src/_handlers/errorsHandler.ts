import { Request, Response } from 'express';

export default class ErrorsHandler {
    static handle(err: Error, req: Request, res: Response) {
        if (err['statusCode']) {
            res.status(err['statusCode']).send(err.message);
            console.error(err.message);
            return;
        }
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
