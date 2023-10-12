import tipsRepositoryInterface from '../ports/tipsRepositoryInterface';
import * as dotenv from 'dotenv';
import Tips from "../models/Tips";
import PaginatedResponse from "../../../_common/domain/models/paginatedResponse";
import PaginatedInput from "../../../_common/domain/models/paginatedInput";
dotenv.config();

export interface listTipsRepositoryInterface {
    getList(input: PaginatedInput): Promise<PaginatedResponse<Tips>>;
}

export default class ListTipsUseCase implements listTipsRepositoryInterface {
    constructor(private readonly _tipsRepository: tipsRepositoryInterface) {}

    async getList(input: PaginatedInput): Promise<PaginatedResponse<Tips>> {
        const tipsList = await this._tipsRepository.getList(input.page, input.length);
        return new PaginatedResponse(
            input.page,
            input.length,
            tipsList.total,
            tipsList.tips
        )
    }
}