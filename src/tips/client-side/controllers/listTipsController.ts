import ListTipsUseCase from '../../domain/use_cases/listTipsUseCase';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { NextFunction, Response } from 'express';
import PaginatedInput from '../../../_common/domain/models/paginatedInput';
import PaginatedResponse from '../../../_common/domain/models/paginatedResponse';
import Tips from '../../domain/models/Tips';

export default class ListTipsController {
    constructor(private readonly _listTipsUseCase: ListTipsUseCase) {}

    public async tipsList(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const paginatedInput = new PaginatedInput(
                req.query.page ? +req.query.page : 1,
                req.query.length ? +req.query.length : 14,
            );

            const paginatedResponse: PaginatedResponse<Tips> = await this._listTipsUseCase.getList(paginatedInput);

            return res.status(200).send(paginatedResponse);
        } catch (err) {
            console.log(err.message);
            next(err);
        }
    }
}
