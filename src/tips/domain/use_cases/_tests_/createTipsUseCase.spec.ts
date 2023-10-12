import ListTipsUseCase from '../listTipsUseCase';
import Tips from '../../models/Tips';
import TipsRepositoryInMemory from '../../../server-side/repositories/tipsRepositoryInMemory';
import TipsTestBuilder from './TipsTestBuilder';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import PaginatedResponse from '../../../../_common/domain/models/paginatedResponse';
import InputRegisterUser from "../../../../user/domain/models/inputRegisterUser";
import InputTips from "../../models/inputTips";
import CreateTipsUseCase from "../../../../tips/domain/use_cases/createTipsUseCase";
import RegisterUserUseCase from "../../../../user/domain/use_cases/registerUserUseCase";
import UserRepositoryInMemory from "../../../../user/server-side/repositories/userRepositoryInMemory";
import InputError from "../../../../_common/domain/errors/inputError";
dotenv.config();

describe('Return a tips', () => {
    let tipsRepository: TipsRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        tipsRepository = new TipsRepositoryInMemory();
        sut = new SUT(tipsRepository);
    });

    afterEach(() => {
        tipsRepository.clear();
    });

    test('can create a new tips', async () => {
        const inputTips = sut.givenAnInputTips();
        const expectedTips = sut.givenATips();

        const tipsJustCreated = await new CreateTipsUseCase(tipsRepository).create(inputTips);

        expect(tipsJustCreated).toEqual(expectedTips);
    });

    test('return an errors message if persist tips failed and return null', async () => {
        try {
            const inputTips = sut.givenAnInputTips();
            sut.givenAnError();
            await new CreateTipsUseCase(tipsRepository).create(inputTips);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Create tips failed !');
        }
    });

    test('an input must have the good format', async () => {
        try {
            const inputTips = sut.givenAnInputTipsWithBadInputFormat();
            await new CreateTipsUseCase(tipsRepository).create(inputTips);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Create tips failed !');
        }
    });
});

class SUT {
    private _tipsTestBuilder: TipsTestBuilder;
    constructor(private readonly _tipsRepositoryInMemory: TipsRepositoryInMemory) {
        this._tipsTestBuilder = new TipsTestBuilder();
    }

    givenAnInputTips(): InputTips {
        return this._tipsTestBuilder.buildInputTips();
    }

    givenATips(): Tips {
        const tips = this._tipsTestBuilder
            .withTitle(faker.lorem.words({ min: 2, max: 4 }))
            .withCommand(faker.lorem.words({ min: 3, max: 9 }))
            .withDescription(faker.lorem.paragraph({ min: 1, max: 3 }))
            .buildTips();
        this._tipsRepositoryInMemory.setTips(tips);
        return tips;
    }

    givenAnError(): TipsRepositoryInMemory {
        return this._tipsRepositoryInMemory.setError();
    }

    givenAnInputTipsWithBadInputFormat(): InputTips {
        this._tipsTestBuilder.withTitle('');
        return this._tipsTestBuilder.buildInputTips();
    }
}
