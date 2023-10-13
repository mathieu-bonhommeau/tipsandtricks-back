import tipsRepositoryInterface from '../ports/tipsRepositoryInterface';
import * as dotenv from 'dotenv';
import Tips from '../models/Tips';
import InputTips from '../models/inputTips';
import InputError from '../../../_common/domain/errors/inputError';
import debug from 'debug';
import AuthError from "../../../_common/domain/errors/authError";
dotenv.config();
const logger = debug('tipsandtricks:registerUserUseCase');

export interface updateTipsRepositoryInterface {
    update(tipsId : number, userId: number, input: InputTips): Promise<Tips | number>;
}

export default class UpdateTipsUseCase implements updateTipsRepositoryInterface {
    constructor(private readonly _tipsRepository: tipsRepositoryInterface) {}

    async update(tipsId : number, userId: number, input: InputTips): Promise<Tips | number> {
        if (!tipsId) {
            logger('tipsId invalid');
            throw new InputError('Updated tips failed !');
        }

        if (!this.inputTipsValidateFormat(input)) {
            logger('format invalid');
            throw new InputError('Updated tips failed !');
        }

        const tipsJustUpdated = await this._tipsRepository.update(tipsId, userId, input);

        if (tipsJustUpdated === 401) {
            logger('user invalid');
            throw new AuthError('Updated tips failed !');
        }

        if (tipsJustUpdated === 400) {
            logger('bdd error');
            throw new InputError('Updated tips failed !');
        }

        return tipsJustUpdated;
    }

    private inputTipsValidateFormat(inputTipsData: InputTips): boolean {
        const isValid: boolean[] = [];

        for (const [inputKey, value] of Object.entries(inputTipsData)) {
            switch (inputKey) {
                case 'title':
                    isValid.push(this._checkFormat(value));
                    break;
                case 'command':
                    isValid.push(this._checkFormat(value));
                    break;
            }
        }
        return isValid.every((item) => item);
    }

    public _checkFormat(value: string): boolean {
        const regex = /\w+/g;
        return regex.test(value);
    }
}
