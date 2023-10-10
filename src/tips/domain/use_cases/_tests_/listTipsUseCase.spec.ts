import ListTipsUseCase from '../listTipsUseCase';
import Tips from '../../models/Tips';
import TipsRepositoryInMemory from '../../../server-side/repositories/tipsRepositoryInMemory';
import TipsTestBuilder from './TipsTestBuilder';
import * as dotenv from 'dotenv';
import {faker} from "@faker-js/faker";
dotenv.config();

describe('Return tips list', () => {
    let tipsRepository: TipsRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        tipsRepository = new TipsRepositoryInMemory();
        sut = new SUT(tipsRepository);
    });

    test('can return a list of tips', async () => {
        const execptedlistOfTips = sut.givenAListOfTips();
        // console.log(execptedlistOfTips);
        const listOfTip = await new ListTipsUseCase(tipsRepository).getList();
        console.log(listOfTip);

        expect(listOfTip).toEqual(execptedlistOfTips);
    });
});

class SUT {
    private _tipsTestBuilder: TipsTestBuilder;
    constructor(private readonly _tipsRepositoryInMemory: TipsRepositoryInMemory) {
        this._tipsTestBuilder = new TipsTestBuilder();
    }

    givenATips(): Tips {
        const tips = this._tipsTestBuilder
            .withTitle(faker.lorem.words({ min: 2, max: 4  }))
            .withCommand(faker.lorem.words({ min: 3, max: 9  }))
            .withDescription(faker.lorem.paragraph({ min: 1, max: 3 }))
            .buildTips();
        this._tipsRepositoryInMemory.setTips(tips);
        return tips
    }

    givenAListOfTips(): Array<Tips> {
        const listOfTips = [];
        for (let i = 0; i < 10; i++) {
            listOfTips.push(this.givenATips());
        }

        return listOfTips
    }
}
