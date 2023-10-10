import UserRepositoryInMemory from '../../../server-side/repositories/userRepositoryInMemory';
import UserTestBuilder from './UserTestBuilder';
import InputLoginUser from '../../models/inputLoginUser';
import AuthUserUseCase from '../authUserUseCase';
import User, { JwtToken, UserLogged } from '../../models/User';
import UserFactory from '../../factories/userFactory';

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

        test("can throw an error if the email doesn't exists in database", async () => {
            try {
                const inputLoginUser = sut.givenAnInputLoginUser();
                sut.givenAUserWithNotExistEmail();
                await new AuthUserUseCase(userRepository).login(inputLoginUser);
                expect(false).toEqual(true);
            } catch (err) {
                expect(err.message).toEqual('Login error !');
            }
        });

        test('can throw an error if the password is not ok', async () => {
            try {
                const inputLoginUser = sut.givenAnInputLoginUser();
                sut.givenAUserWithBadPassword();
                await new AuthUserUseCase(userRepository).login(inputLoginUser);
                expect(false).toEqual(true);
            } catch (err) {
                expect(err.message).toEqual('Login error !');
            }
        });

        test('if a user is logged successfully, the server send an access_token and refresh_token', async () => {
            const inputLoginUser = sut.givenAnInputLoginUser();
            sut.givenAUser();
            const userLogged = (await new AuthUserUseCase(userRepository).login(inputLoginUser)) as UserLogged;
            expect(userLogged.tokens.access_token).not.toBeNull();
            expect(userLogged.tokens.refresh_token).not.toBeNull();
        });
    });

    describe('Token refresh', () => {
        test('returns a new access_token and a new refresh_token', async () => {
            const userLogged = await sut.givenALoggedUser();
            const tokens = (await new AuthUserUseCase(userRepository).refreshToken(userLogged.user.email)) as JwtToken;
            expect(tokens.access_token).not.toBeNull();
            expect(tokens.refresh_token).not.toBeNull();
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
