import RegisterUserUseCase from '../registerUserUseCase';
import User from '../../models/User';
import InputRegisterUser from '../../models/inputRegisterUser';
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
        const inputRegisterUser = sut.givenAnInputRegisterUser();
        const expectedUser = sut.givenAUser();

        const userJustCreated = await new RegisterUserUseCase(userRepository).register(inputRegisterUser);
        expect(userJustCreated).toEqual(expectedUser);
    });

    test('return an error message if persist user failed and return null', async () => {
        //TODO - use toThrow for check this test
        try {
            const inputRegisterUser = sut.givenAnInputRegisterUser();
            sut.givenAnError();
            await new RegisterUserUseCase(userRepository).register(inputRegisterUser);
            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Register failed !');
        }
    });

    test('return an error message if password is too weak', async () => {
        try {
            const inputRegisterUser = sut.givenAnInputRegisterUserWithWeakPassword();
            await new RegisterUserUseCase(userRepository).register(inputRegisterUser);
            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Register failed !');
        }
    });

    test('the password is hash in the database', async () => {
        const inputRegisterUser = sut.givenAnInputRegisterUser();
        const expectedHashPassword = await bcrypt.hashSync(
            inputRegisterUser.password,
            parseInt(process.env.ROUND_SALT_PWD),
        );

        await new RegisterUserUseCase(userRepository).register(inputRegisterUser);

        // For the test, we need to slice the 2 string for check only 6 first letters - the others are random
        expect(userRepository.getPassword().slice(0, 6)).toEqual(expectedHashPassword.slice(0, 6));
    });

    test('a username must have 2 or more than 2 characters', async () => {
        try {
            const inputRegisterUser = sut.givenAnInputRegisterUserWithATooLittleUsername();
            await new RegisterUserUseCase(userRepository).register(inputRegisterUser);
            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Register failed !');
        }
    });

    test('an email must have the good format', async () => {
        try {
            const inputRegisterUser = sut.givenAnInputRegisterUserWithABadEmailFormat();
            await new RegisterUserUseCase(userRepository).register(inputRegisterUser);
            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Register failed !');
        }
    });
});

class SUT {
    private _userTestBuilder: UserTestBuilder;
    constructor(private readonly _userRepositoryInMemory: UserRepositoryInMemory) {
        this._userTestBuilder = new UserTestBuilder();
    }
    givenAnInputRegisterUser(): InputRegisterUser {
        return this._userTestBuilder.buildInputRegisterUser();
    }
    givenAUser(): User {
        return this._userTestBuilder.buildUser();
    }

    givenAnError(): UserRepositoryInMemory {
        return this._userRepositoryInMemory.setError();
    }

    givenAnInputRegisterUserWithWeakPassword(): InputRegisterUser {
        this._userTestBuilder.withPassword('passwordweak');
        return this._userTestBuilder.buildInputRegisterUser();
    }

    givenAnInputRegisterUserWithATooLittleUsername(): InputRegisterUser {
        this._userTestBuilder.withUsername('t');
        return this._userTestBuilder.buildInputRegisterUser();
    }

    givenAnInputRegisterUserWithABadEmailFormat(): InputRegisterUser {
        this._userTestBuilder.withEmail('test');
        return this._userTestBuilder.buildInputRegisterUser();
    }
}
