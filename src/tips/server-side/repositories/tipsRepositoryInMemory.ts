import TipsRepositoryInterface from '../../domain/ports/tipsRepositoryInterface';
import Tips from '../../domain/models/Tips';
import * as dotenv from 'dotenv';
import User from "../../../user/domain/models/User";
dotenv.config();

export default class TipsRepositoryInMemory implements TipsRepositoryInterface {
    private _tipsInMemory: Array<Tips> = [];
    private _error: boolean = false;

    setTips(tips: Tips): TipsRepositoryInMemory {
        this._tipsInMemory.push(tips);
        return this;
    }

    async getList(): Promise<Array<Tips>> {
        return this._tipsInMemory;
    }

    setError(): TipsRepositoryInMemory {
        this._error = true;
        return this;
    }

    clear(): TipsRepositoryInMemory {
        this._tipsInMemory = []
        return this
    }

}
