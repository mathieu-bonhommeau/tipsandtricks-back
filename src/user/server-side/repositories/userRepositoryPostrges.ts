import UserRepositoryInterface from '../../domain/ports/userRepositoryInterface';
import InputRegisterUser from '../../domain/models/inputRegisterUser';
import User from '../../domain/models/User';
import { Row, Sql } from 'postgres';

export default class UserRepositoryPostgres implements UserRepositoryInterface {
    constructor(private readonly _sql: Sql) {}
    async create(input: InputRegisterUser): Promise<User | null> {
        return this._sql`insert into "user" ${this._sql(
            input,
        )} returning id, email, username, roles, created_at, updated_at`.then((rows) => {
            if (rows.length > 0) {
                return UserRepositoryPostgresFactory.create(rows[0]);
            }
            return null;
        });
    }
}

export class UserRepositoryPostgresFactory {
    static create(row: Row): User {
        return new User(row.id, row.email, row.username, row.roles, row.created_at, row.updated_at);
    }
}
