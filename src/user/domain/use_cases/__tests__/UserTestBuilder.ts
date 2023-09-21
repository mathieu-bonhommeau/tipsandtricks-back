import User, { Roles } from '../../models/User';
import InputUserData from '../../models/inputUserData';

export default class UserTestBuilder {
    private readonly _id: number | null = 1;
    private _email: string = 'email@email.com';
    private _username: string = 'usertest';
    private _password: string = '_qyU1)"v@2^9';
    private readonly _roles: Roles | null = null;
    private readonly _refresh_token: string | null = null;
    private readonly _created_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _updated_at: Date | null = null;

    buildUser(): User {
        return new User(this._id, this._email, this._username, this._roles, this._created_at, this._updated_at);
    }

    buildInputUserData(): InputUserData {
        return new InputUserData(this._email, this._username, this._password);
    }

    withEmail(email: string): UserTestBuilder {
        this._email = email;
        return this;
    }

    withUsername(username: string): UserTestBuilder {
        this._username = username;
        return this;
    }

    withPassword(password: string): UserTestBuilder {
        this._password = password;
        return this;
    }
}
