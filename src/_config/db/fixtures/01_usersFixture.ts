import { Sql } from 'postgres';
import InputRegisterUser from '../../../user/domain/models/inputRegisterUser';
import { faker } from '@faker-js/faker';

export default class UsersFixtures {
    constructor(private readonly _sql: Sql) {}

    public async givenSomeUsers(count: number) {
        const users: InputRegisterUser[] = [];

        while (count--) {
            users.push(
                new InputRegisterUser(faker.internet.email(), faker.internet.userName(), faker.internet.password()),
            );
        }

        await this._sql`insert into "user" ${this._sql(users)}`.then((rows) => rows.length);
    }
}
