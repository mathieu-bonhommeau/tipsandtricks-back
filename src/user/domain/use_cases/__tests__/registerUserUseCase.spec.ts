import RegisterUserUseCase from '../registerUserUseCase';
import User from '../../models/User';
import InputUserData from '../../models/inputUserData';
import UserRepositoryInMemory from '../../../server-side/repositories/userRepositoryInMemory';
import UserTestBuilder from './UserTestBuilder';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

describe('Register a user', () => {
    let userRepository: UserRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        userRepository = new UserRepositoryInMemory();
        sut = new SUT(userRepository);
    });

    test('can register a user', async () => {
        const inputUserDatas = sut.givenAnInputUserData();
        const expectedUser = sut.givenAUser();

        const userJustCreated = await new RegisterUserUseCase(userRepository).register(inputUserDatas);
        expect(userJustCreated).toEqual(expectedUser);
    });

    test('return an error message if persist user failed and return null', async () => {
        const inputUserDatas = sut.givenAnInputUserData();
        sut.givenAnError();
        const errorResponse = await new RegisterUserUseCase(userRepository).register(inputUserDatas);
        expect(errorResponse).toEqual({ message: 'Register failed !' });
    });

    test('return an error message if password is too weak', async () => {
        const inputUserDatas = sut.givenAnInputUserDataWithWeakPassword();
        const errorResponse = await new RegisterUserUseCase(userRepository).register(inputUserDatas);
        expect(errorResponse).toEqual({ message: 'Register failed !' });
    });

    test('the password is hash in the database', async () => {
        const inputUserDatas = sut.givenAnInputUserData();
        const expectedHashPassword = await bcrypt.hashSync(
            inputUserDatas.password,
            parseInt(process.env.ROUND_SALT_PWD),
        );

        await new RegisterUserUseCase(userRepository).register(inputUserDatas);

        // For the test, we need to slice the 2 string for check only 6 first letters - the others are random
        expect(userRepository.getPassword().slice(0, 6)).toEqual(expectedHashPassword.slice(0, 6));
    });

    test('a username must have 2 or more than 2 characters', async () => {
        const inputUserDatas = sut.givenAnInputDataWithATooLittleUsername();
        const errorResponse = await new RegisterUserUseCase(userRepository).register(inputUserDatas);
        expect(errorResponse).toEqual({ message: 'Register failed !' });
    });

    test('an email must have the good format', async () => {
        const inputUserDatas = sut.givenAnInputDataWithABadEmailFormat();
        const errorResponse = await new RegisterUserUseCase(userRepository).register(inputUserDatas);
        expect(errorResponse).toEqual({ message: 'Register failed !' });
    });
});

class SUT {
    private _userTestBuilder: UserTestBuilder;
    constructor(private readonly _userRepositoryInMemory: UserRepositoryInMemory) {
        this._userTestBuilder = new UserTestBuilder();
    }
    givenAnInputUserData(): InputUserData {
        return this._userTestBuilder.buildInputUserData();
    }
    givenAUser(): User {
        return this._userTestBuilder.buildUser();
    }

    givenAnError(): void {
        return this._userRepositoryInMemory.setError();
    }

    givenAnInputUserDataWithWeakPassword(): InputUserData {
        this._userTestBuilder.withPassword('passwordweak');
        return this._userTestBuilder.buildInputUserData();
    }

    givenAnInputDataWithATooLittleUsername(): InputUserData {
        this._userTestBuilder.withUsername('t');
        return this._userTestBuilder.buildInputUserData();
    }

    givenAnInputDataWithABadEmailFormat(): InputUserData {
        this._userTestBuilder.withEmail('test');
        return this._userTestBuilder.buildInputUserData();
    }
}
