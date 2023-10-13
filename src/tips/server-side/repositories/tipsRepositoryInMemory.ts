import TipsRepositoryInterface, { TipsList } from '../../domain/ports/tipsRepositoryInterface';
import Tips from '../../domain/models/Tips';
import * as dotenv from 'dotenv';
import InputTips from '../../domain/models/inputTips';
dotenv.config();

export default class TipsRepositoryInMemory implements TipsRepositoryInterface {
    public tipsInMemory: Array<Tips> = [];
    private _error: boolean = false;

    async create(input: InputTips): Promise<Tips | null> {
        if (!this._error) {
            this.tipsInMemory.push(
                new Tips(
                    1,
                    input.user_id,
                    input.title,
                    input.command,
                    input.description,
                    new Date('2022-12-17T03:24:00'),
                    new Date('2022-12-17T03:24:00'),
                    null,
                ),
            );
            return this.tipsInMemory[0];
        }
        return null;
    }

    async getList(userId: number, page: number, length: number): Promise<TipsList> {
        const start = length * (page - 1);
        const end = length * page;
        const tips = this.tipsInMemory.filter((element) => element.user_id === userId);
        return {
            tips: tips.slice(start, end),
            total: tips.length,
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
