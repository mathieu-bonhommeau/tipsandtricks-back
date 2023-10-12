import tipsRepositoryInterface from '../ports/tipsRepositoryInterface';
import * as dotenv from 'dotenv';
import Tips from '../models/Tips';
import PaginatedResponse from '../../../_common/domain/models/paginatedResponse';
import PaginatedInput from '../../../_common/domain/models/paginatedInput';
import InputTips from "../models/inputTips";
import {UsernameAlreadyExistInputError} from "../../../_common/domain/errors/inputError";
import debug from "debug";
dotenv.config();
const logger = debug('tipsandtricks:registerUserUseCase');

export interface listTipsRepositoryInterface {
    create(input: InputTips): Promise<Tips>;
}

export default class ListTipsUseCase implements listTipsRepositoryInterface {
    constructor(private readonly _tipsRepository: tipsRepositoryInterface) {}

    async create(input: InputTips): Promise<Tips> {
        const tipsJustCreated = await this._tipsRepository.create(input);

        if (!tipsJustCreated) {
            logger('bdd error');

            // TODO Create error
            //throw new UsernameAlreadyExistInputError('Register failed !');
        }
        return tipsJustCreated;
    }
}
