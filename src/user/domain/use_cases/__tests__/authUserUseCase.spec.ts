import UserRepositoryInMemory from '../../../server-side/repositories/userRepositoryInMemory';
import UserTestBuilder from './UserTestBuilder';
import InputLoginUser from '../../models/inputLoginUser';
import AuthUserUseCase from '../authUserUseCase';
import User, { JwtToken, UserLogged } from '../../models/User';
import UserFactory from '../../factories/userFactory';
import { faker } from '@faker-js/faker';

describe('Login a user', () => {
    let userRepository: UserRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        userRepository = new UserRepositoryInMemory();
        sut = new SUT(userRepository);
    });

    describe('Login', () => {
        test('can login a user', async () => {
            const inputLoginUser = sut.givenAnInputLoginUser();
            const expectedUser = sut.givenAUser();
            const userLogged = (await new AuthUserUseCase(userRepository).login(inputLoginUser)) as UserLogged;
            expect(userLogged.user).toEqual(UserFactory.createWithoutPassword(expectedUser));
        });

        test("can throw an errors if the email doesn't exists in database", async () => {
            try {
                const inputLoginUser = sut.givenAnInputLoginUser();
                sut.givenAUserWithNotExistEmail();
                await new AuthUserUseCase(userRepository).login(inputLoginUser);
                //This expect breaks the test because it must throw an error
                expect(false).toEqual(true);
            } catch (err) {
                expect(err.message).toEqual('Login errors !');
            }
        });

        test('can throw an errors if the password is not ok', async () => {
            try {
                const inputLoginUser = sut.givenAnInputLoginUser();
                sut.givenAUserWithBadPassword();
                await new AuthUserUseCase(userRepository).login(inputLoginUser);
                //This expect breaks the test because it must throw an error
                expect(false).toEqual(true);
            } catch (err) {
                expect(err.message).toEqual('Login errors !');
            }
        });

        test('if a user is logged successfully, the server send an access_token and refresh_token and the refresh token is saved in DB  ', async () => {
            const inputLoginUser = sut.givenAnInputLoginUser();
            sut.givenAUser();

            const userLogged = (await new AuthUserUseCase(userRepository).login(inputLoginUser)) as UserLogged;
            expect(userLogged.tokens.access_token).not.toBeNull();
            expect(userLogged.tokens.refresh_token).not.toBeNull();

            const user = await userRepository.getByEmail(userLogged.user.email);
            expect(user.refresh_token).toEqual(userLogged.tokens.refresh_token);
        });
    });

    describe('Token refresh', () => {
        test('returns a new access_token and a new refresh_token', async () => {
            const userLogged = await sut.givenALoggedUser();

            const tokens = (await new AuthUserUseCase(userRepository).refreshToken(userLogged.user.email)) as JwtToken;
            expect(tokens.access_token).not.toBeNull();
            expect(tokens.refresh_token).not.toBeNull();

            const user = await userRepository.getByEmail(userLogged.user.email);
            expect(user.refresh_token).toEqual(userLogged.tokens.refresh_token);
        });
    });

    describe('Check refresh token', () => {
        test('return true if the refresh_token used is the same as that recorded in bdd', async () => {
            const userLogged = await sut.givenALoggedUser();
            const res = await new AuthUserUseCase(userRepository).checkRefreshToken(
                userLogged.user.email,
                userLogged.tokens.refresh_token,
            );
            expect(res).toBe(true);
        });

        test('return false if refresh_token used is not the same as that recorded in bdd', async () => {
            const userLogged = await sut.givenALoggedUser();
            const res = await new AuthUserUseCase(userRepository).checkRefreshToken(
                userLogged.user.email,
                'invalid_token',
            );
            expect(res).toBe(false);
        });
    });

    describe('Delete refresh token', () => {
        test('return void and throw no error if refresh token is delete for this user', async () => {
            // This try catch allows to check if an error is throw
            try {
                const userLogged = await sut.givenALoggedUser();
                await new AuthUserUseCase(userRepository).revokeRefreshToken(userLogged.user.email);
                expect(true).toBe(true);
            } catch (err) {
                //This expect breaks the test because it must not throw an error
                expect(true).toBe(false);
            }
        });

        test('throw error if user does not exist', async () => {
            try {
                await sut.givenALoggedUser();
                await new AuthUserUseCase(userRepository).revokeRefreshToken(faker.internet.email())
                //This expect breaks the test because it must throw an error
                expect(true).toBe(false)
            } catch (err) {
                expect(true).toBe(true);
            }
        });
    });
});

class SUT {
    private _userTestBuilder: UserTestBuilder;
    constructor(private readonly _userRepositoryInMemory: UserRepositoryInMemory) {
        this._userTestBuilder = new UserTestBuilder();
    }

    givenAnInputLoginUser(): InputLoginUser {
        return this._userTestBuilder.buildInputLoginUser();
    }
    givenAUser(): User {
        const user = this._userTestBuilder.buildUserWithPassword();
        this._userRepositoryInMemory.setUser(user);
        return user;
    }

    givenAUserWithNotExistEmail(): User {
        this._userTestBuilder.withEmail('notexist@email.com');
        const user = this._userTestBuilder.buildUser();
        this._userRepositoryInMemory.setUser(user);
        return user;
    }

    givenAUserWithBadPassword(): User {
        this._userTestBuilder.withHashPassword('notthegood');
        const user = this._userTestBuilder.buildUserWithPassword();
        this._userRepositoryInMemory.setUser(user);
        return user;
    }

    async givenALoggedUser(): Promise<UserLogged> {
        const inputLoginUser = this.givenAnInputLoginUser();
        this.givenAUser();
        return (await new AuthUserUseCase(this._userRepositoryInMemory).login(inputLoginUser)) as UserLogged;
    }
}
