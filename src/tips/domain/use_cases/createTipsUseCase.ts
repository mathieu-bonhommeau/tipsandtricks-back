import tipsRepositoryInterface from '../ports/tipsRepositoryInterface';
import * as dotenv from 'dotenv';
import Tips from '../models/Tips';
import InputTips from '../models/inputTips';
import InputError from '../../../_common/domain/errors/inputError';
import debug from 'debug';
dotenv.config();
const logger = debug('tipsandtricks:registerUserUseCase');

export interface listTipsRepositoryInterface {
    create(input: InputTips): Promise<Tips>;
}

export default class ListTipsUseCase implements listTipsRepositoryInterface {
    constructor(private readonly _tipsRepository: tipsRepositoryInterface) {}

    async create(input: InputTips): Promise<Tips> {
        if (!this.inputTipsValidateFormat(input)) {
            logger('format invalid');
            throw new InputError('Create tips failed !');
        }

        const tipsJustCreated = await this._tipsRepository.create(input);

        if (!tipsJustCreated) {
            logger('bdd error');
            throw new InputError('Create tips failed !');
        }
        return tipsJustCreated;
    }

    private inputTipsValidateFormat(inputTipsData: InputTips): boolean {
        const isValid: boolean[] = [];

        for (const [inputKey, value] of Object.entries(inputTipsData)) {
            switch (inputKey) {
                case 'title':
                    isValid.push(this._checkTitleFormat(value));
                    break;
                case 'description':
                    isValid.push(this._checkDescriptionFormat(value));
                    break;
                case 'command':
                    isValid.push(this._checkCommandFormat(value));
                    break;
            }
        }

        return isValid.every((item) => item);
    }

    public _checkTitleFormat(description: string): boolean {
        // A améliorer ?
        const regex = /\w+/g;
        return regex.test(description);
    }

    public _checkDescriptionFormat(description: string): boolean {
        const regex = /\w+/g;
        return regex.test(description);
    }

    public _checkCommandFormat(command: string): boolean {
        const regex = /\w+/g;
        return regex.test(command);
    }
}
