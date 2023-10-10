import tipsRepositoryInterface from '../ports/tipsRepositoryInterface';
import * as dotenv from 'dotenv';
import Tips from "../models/Tips";
dotenv.config();

export interface listTipsRepositoryInterface {
    getList(): Promise<Array<Tips>>;
}

export default class ListTipsUseCaseUseCase implements listTipsRepositoryInterface {
    constructor(private readonly _tipsRepository: tipsRepositoryInterface) {}

    async getList(): Promise<Array<Tips>> {
        const listOfTips = await this._tipsRepository.getList();
        if (!listOfTips) {
            console.error('BDD error')
        }

        return listOfTips;
    }
}
