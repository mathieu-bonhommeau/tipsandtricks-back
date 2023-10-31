import { Sql } from 'postgres';
import { faker } from '@faker-js/faker';
import InputPost from '../../../post/domain/model/inputCreatePost';

export default class PostsFixtures {
    constructor(private readonly _sql: Sql) {}

    public async givenSomePosts(count: number) {
        const posts: InputPost[] = [];
        const usersIds = await this._sql`select "id" from "user"`.then((rows) => rows);

        while (count--) {
            posts.push(
                new InputPost(
                    faker.lorem.words(3),
                    faker.lorem.slug(),
                    faker.lorem.text(),
                    faker.lorem.text(),
                    faker.lorem.text(),
                    usersIds[Math.floor(Math.random() * usersIds.length)].id,
                ),
            );
        }

        await this._sql`insert into "post" ${this._sql(posts)}`.then((rows) => rows.length);
    }
}
