import TipsRepositoryInterface, { TipsList } from '../../domain/ports/tipsRepositoryInterface';
import Tips from '../../domain/models/Tips';
import * as dotenv from 'dotenv';
dotenv.config();

export default class TipsRepositoryInMemory implements TipsRepositoryInterface {
    public tipsInMemory: Array<Tips> = [];
    private _error: boolean = false;

    async getList(page: number, length: number): Promise<TipsList> {
        const start = length * (page - 1);
        const end = length * page;
        return {
            tips: this.tipsInMemory.slice(start, end),
            total: this.tipsInMemory.length,
        };
    }

    setTips(tips: Tips): TipsRepositoryInMemory {
        this.tipsInMemory.push(tips);
        return this;
    }

    setError(): TipsRepositoryInMemory {
        this._error = true;
        return this;
    }

    clear(): TipsRepositoryInMemory {
        this.tipsInMemory = [];
        return this;
    }
}
