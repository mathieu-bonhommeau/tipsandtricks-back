import ListTipsUseCase from '../listTipsUseCase';
import Tips from '../../models/Tips';
import TipsRepositoryInMemory from '../../../server-side/repositories/tipsRepositoryInMemory';
import TipsTestBuilder from './TipsTestBuilder';
import * as dotenv from 'dotenv';
import {faker} from "@faker-js/faker";
import PaginatedResponse from "../../../../_common/domain/models/paginatedResponse";
dotenv.config();

describe('Return tips list', () => {
    let tipsRepository: TipsRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        tipsRepository = new TipsRepositoryInMemory();
        sut = new SUT(tipsRepository);
    });

    afterEach(() => {
        tipsRepository.clear()
    })

    test('can return a list of tips in a paginated response', async () => {
        const expectedTips = sut.givenAListOfTips();
        const expectedResponse = sut.buildAPaginatedResponse(1, 50, expectedTips)

        const listOfTip = await new ListTipsUseCase(tipsRepository).getList({page: 1, length: 50});
        expect(listOfTip).toEqual(expectedResponse);

    });

    test('can return an errors if there is no tips in bdd', async ()     => {
        const expectedResponse = sut.buildAPaginatedResponse(1, 50, [])

        const listOfTips = await new ListTipsUseCase(tipsRepository).getList({page: 1, length: 50});
        expect(listOfTips).toEqual(expectedResponse)
    });

    test('can returns the first 10 tips when page = 1 and length = 10', async () => {
        const execptedlistOfTips = sut.givenAListOfTips();
        const expectedResponse = sut.buildAPaginatedResponse(1, 10, execptedlistOfTips.slice(0, 10))

        const listOfTips = await new ListTipsUseCase(tipsRepository).getList({page: 1, length: 10});
        expect(listOfTips.data.length).toEqual(10)
        expect(listOfTips).toEqual(expectedResponse)
    })
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
        for (let i = 0; i < 50; i++) {
            listOfTips.push(this.givenATips());
        }

        return listOfTips
    }

    buildAPaginatedResponse(page: number, length: number, tips: Tips[]): PaginatedResponse<Tips> {
        return new PaginatedResponse<Tips>(
            page,
            length,
            this._tipsRepositoryInMemory.tipsInMemory.length,
            tips
        )
    }
}
