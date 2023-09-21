import UserRepositoryInterface from '../../domain/ports/userRepositoryInterface';
import InputUserData from '../../domain/models/inputUserData';
import User from '../../domain/models/User';

export default class UserRepositoryInMemory implements UserRepositoryInterface {
    private _userJustCreated: User | null = null;
    private _password: string;
    private _error: boolean = false;
    async create(input: InputUserData): Promise<User | null> {
        if (!this._error) {
            this._userJustCreated = new User(
                1,
                input.email,
                input.username,
                null,
                new Date('2022-12-17T03:24:00'),
                null,
            );
            this._password = input.password;
            return this._userJustCreated;
        }
        return null;
    }

    setError(): void {
        this._error = true;
    }

    getPassword(): string {
        return this._password;
    }
}
