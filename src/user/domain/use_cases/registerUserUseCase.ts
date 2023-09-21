import InputUserData from '../models/inputUserData';
import User from '../models/User';
import UserRepositoryInterface from '../ports/userRepositoryInterface';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import InputError from '../../../_common/domain/models/inputError';
dotenv.config();

export interface RegisterUserUseCaseInterface {
    register(input: InputUserData): Promise<User | InputError>;
}

export default class RegisterUserUseCase implements RegisterUserUseCaseInterface {
    constructor(private readonly _userRepository: UserRepositoryInterface) {}
    async register(input: InputUserData): Promise<User | InputError> {
        const isUsernameLongEnough = this._checkLengthUsername(input.username);
        if (!isUsernameLongEnough) {
            return new InputError('Username too short !');
        }

        const isPasswordStrong = this._checkStrengthPassword(input.password);
        if (!isPasswordStrong) {
            return new InputError('Password too weak !');
        }

        input.password = bcrypt.hashSync(input.password, parseInt(process.env.ROUND_SALT_PWD));

        const userJustCreated = await this._userRepository.create(input);

        if (!userJustCreated) {
            return new InputError('Register failed !');
        }

        return userJustCreated;
    }

    private _checkStrengthPassword(password: string): boolean {
        const passwordRegex = /^(?=(?:.*\d))(?=(?:.*[a-zA-Z]))(?=(?:.*[A-Z])).{12,}$/;
        return passwordRegex.test(password);
    }

    private _checkLengthUsername(username: string): boolean {
        return !(username.length < 2);
    }
}
