import InputRegisterUser from '../models/inputRegisterUser';
import User from '../models/User';
import UserRepositoryInterface from '../ports/userRepositoryInterface';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import InputError from '../../../_common/domain/models/inputError';
dotenv.config();

export interface RegisterUserUseCaseInterface {
    register(input: InputRegisterUser): Promise<User | InputError>;
}

export default class RegisterUserUseCase implements RegisterUserUseCaseInterface {
    constructor(private readonly _userRepository: UserRepositoryInterface) {}

    async register(input: InputRegisterUser): Promise<User | InputError> {
        if (!this.inputRegisterValidate(input)) {
            throw new InputError('Register failed !');
        }

        input.password = bcrypt.hashSync(input.password, parseInt(process.env.ROUND_SALT_PWD));

        const userJustCreated = await this._userRepository.create(input);
        if (!userJustCreated) {
            throw new InputError('Register failed !');
        }

        return userJustCreated;
    }

    private inputRegisterValidate(inputUserData: InputRegisterUser): boolean {
        const isValid: boolean[] = [];

        for (const [inputKey, value] of Object.entries(inputUserData)) {
            switch (inputKey) {
                case 'email':
                    isValid.push(this._checkEmailFormat(value));
                    break;
                case 'username':
                    isValid.push(this._checkLengthUsername(value));
                    break;
                case 'password':
                    isValid.push(this._checkStrengthPassword(value));
                    break;
            }
        }

        return isValid.every((item) => item);
    }

    private _checkEmailFormat(password: string): boolean {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
        return emailRegex.test(password);
    }

    private _checkStrengthPassword(password: string): boolean {
        const passwordRegex = /^(?=(?:.*\d))(?=(?:.*[a-zA-Z]))(?=(?:.*[A-Z])).{12,}$/;
        return passwordRegex.test(password);
    }

    private _checkLengthUsername(username: string): boolean {
        return !(username.length < 2);
    }
}
