import UserRepositoryInterface from '../../domain/ports/userRepositoryInterface';
import InputRegisterUser from '../../domain/models/inputRegisterUser';
import User from '../../domain/models/User';
import * as dotenv from 'dotenv'
import bcrypt from "bcrypt";
dotenv.config()

export type UserWithPassword = User & {password: string }

export default class UserRepositoryInMemory implements UserRepositoryInterface {
    private _usersInMemory: Array<User | User & {password: string }> = [];
    private _password: string;
    private _error: boolean = false;

    async create(input: InputRegisterUser): Promise<User | null> {
        if (!this._error) {
            this._usersInMemory.push(new User(
                1,
                input.email,
                input.username,
                null,
                new Date('2022-12-17T03:24:00'),
                null,
            ));
            this._password = input.password;
            return this._usersInMemory[0];
        }
        return null;
    }

    async getByEmail(email: string): Promise<User | User & {password: string}> {
        return this._usersInMemory.find((user: User & {password: string}) => user.email === email);
    }

    setUser(user: User): UserRepositoryInMemory {
        this._usersInMemory.push(user);
        return this
    }

    setError(): UserRepositoryInMemory {
        this._error = true;
        return this
    }

    getPassword(): string {
        return this._password;
    }


}
