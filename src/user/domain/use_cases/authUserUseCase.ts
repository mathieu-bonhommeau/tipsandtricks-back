import InputError from '../../../_common/domain/errors/inputError';
import User, { JwtToken, UserLogged } from '../models/User';
import InputLoginUser from '../models/inputLoginUser';
import UserRepositoryInterface from '../ports/userRepositoryInterface';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import debug from 'debug';
import UserFactory from '../factories/userFactory';
import AuthError from '../../../_common/domain/errors/authError';
const logger = debug('tipsandtricks:authUserUseCase');

export interface AuthUserUseCaseInterface {
    login(input: InputLoginUser): Promise<UserLogged | InputError>;
}

export default class AuthUserUseCase implements AuthUserUseCaseInterface {
    constructor(private readonly _userRepository: UserRepositoryInterface) {}

    async login(input: InputLoginUser): Promise<UserLogged | InputError> {
        const user = (await this._userRepository.getByEmail(input.email)) as User & { password: string };
        if (!user) {
            logger('bad email');
            throw new InputError('Login errors !');
        }

        const isSamePassword = bcrypt.compareSync(input.password, user.password);
        if (!isSamePassword) {
            logger('bad password');
            throw new InputError('Login errors !');
        }

        const userToSend = UserFactory.createWithoutPassword(user);
        const jwtTokens = await this._generateTokens(userToSend);

        return new UserLogged(userToSend, jwtTokens);
    }

    async refreshToken(email: string): Promise<JwtToken> {
        const user = await this._userRepository.getByEmail(email);
        if (!user) {
            logger('user does not exist');
            throw new InputError('Refresh token errors !');
        }

        const userToSend = UserFactory.createWithoutPassword(user);
        return await this._generateTokens(userToSend);
    }

    async checkRefreshToken(email: string, refreshToken: string): Promise<boolean> {
        const user = await this._userRepository.getByEmail(email);
        return user.refresh_token === refreshToken;
    }

    async revokeRefreshToken(email: string): Promise<void> {
        const res = await this._userRepository.revokeToken(email);
        if (!res) throw new AuthError('Authentification error');
    }

    private async _generateTokens(user: User): Promise<JwtToken> {
        const accessToken: string = jwt.sign(
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRATION,
                data: user,
            },
            process.env.JWT_SECRET_ACCESS,
        );

        const refreshToken: string = jwt.sign(
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION,
                data: user.email,
            },
            process.env.JWT_SECRET_REFRESH,
        );
        const isStored = await this._userRepository.setRefreshToken(user.id, refreshToken);
        if (!isStored) throw new AuthError('Auth error !');

        return new JwtToken(accessToken, refreshToken);
    }
}
