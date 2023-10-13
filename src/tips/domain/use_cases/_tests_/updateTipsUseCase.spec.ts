import Tips from '../../models/Tips';
import TipsRepositoryInMemory from '../../../server-side/repositories/tipsRepositoryInMemory';
import TipsTestBuilder from './TipsTestBuilder';
import * as dotenv from 'dotenv';
import InputTips from '../../models/inputTips';
import UpdateTipsUseCase from '../updateTipsUseCase';
dotenv.config();

describe('Return a modified tips', () => {
    let tipsRepository: TipsRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        tipsRepository = new TipsRepositoryInMemory();
        sut = new SUT(tipsRepository);
    });

    afterEach(() => {
        tipsRepository.clear();
    });

    test('can update a tips', async () => {
        const inputTips = sut.givenAnInputTips();
        const expectedTips = sut.givenATips(inputTips);

        const tipsJustUpdated = await new UpdateTipsUseCase(tipsRepository).update(1, 1, inputTips);
        expect(tipsJustUpdated).toEqual(expectedTips);
    });

    test('return an error message if persist tips failed and return null', async () => {
        try {
            const inputTips = sut.givenAnInputTips();
            sut.givenAnError();
            await new UpdateTipsUseCase(tipsRepository).update(1, 1, inputTips);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err._statusCode).toEqual(400);
            expect(err.message).toEqual('Updated tips failed !');
        }
    });

    test('an input must have the good format', async () => {
        try {
            const inputTips = sut.givenAnInputTipsWithBadInputFormat();
            await new UpdateTipsUseCase(tipsRepository).update(1, 1, inputTips);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err._statusCode).toEqual(400);
            expect(err.message).toEqual('Updated tips failed !');
        }
    });

    test('return an error message if user doesnt match', async () => {
        try {
            const inputTips = sut.givenAnInputTips();
            sut.givenATips(inputTips);

            await new UpdateTipsUseCase(tipsRepository).update(1, 2, inputTips);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err._statusCode).toEqual(401);
            expect(err.message).toEqual('Updated tips failed !');
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

    givenATips(input: InputTips): Tips {
        const tips = this._tipsTestBuilder
            .withTitle(input.title)
            .withCommand(input.command)
            .withDescription(input.description)
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
