import InputError from '../../../_common/domain/models/inputError';
import User, { JwtToken, UserLogged } from '../models/User';
import InputLoginUser from '../models/inputLoginUser';
import UserRepositoryInterface from '../ports/userRepositoryInterface';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import UserFactory from '../factories/userFactory';

export interface AuthUserUseCaseInterface {
    login(input: InputLoginUser): Promise<UserLogged | InputError>;
}

export default class AuthUserUseCase implements AuthUserUseCaseInterface {
    constructor(private readonly _userRepository: UserRepositoryInterface) {}

    async login(input: InputLoginUser): Promise<UserLogged | InputError> {
        const user = (await this._userRepository.getByEmail(input.email)) as User & { password: string };
        if (!user) throw new InputError('Login error !');

        const isSamePassword = bcrypt.compareSync(input.password, user.password);
        if (!isSamePassword) throw new InputError('Login error !');

        const userToSend = UserFactory.createWithoutPassword(user);
        const jwtTokens = this._generateTokens(userToSend);

        return new UserLogged(userToSend, jwtTokens);
    }

    private _generateTokens(user: User): JwtToken {
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

        return new JwtToken(accessToken, refreshToken);
    }
}
