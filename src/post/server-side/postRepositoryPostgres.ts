import PostRepositoryInterface from '../domain/ports/postRepositoryInterface';
import Post from '../domain/model/post';
import { Row, Sql } from 'postgres';
import InputCreatePost from '../domain/model/inputCreatePost';
import User from '../../user/domain/models/User';

export default class PostRepositoryPostgres implements PostRepositoryInterface {
    constructor(private readonly _sql: Sql) {
    }

    create(input: InputCreatePost): Promise<Post> {
        throw new Error('Method not implemented.');
    }

    async getList(start: number, length: number, userLogged: User | null = null): Promise<Post[]> {
            return await this._sql`
            select p.*,
                   u.username,
                   (select count(*) from "reaction" r where r."post_id" = p."id" and r."reaction" = 'like') as "like",
                   (select count(*) from "reaction" r where r."post_id" = p."id" and r."reaction" = 'dislike') as "dislike"
            from "post" p
            join "user" u on u."id" = p."user_id"
            order by p."id"
            offset ${start}
            limit ${length}`.then((rows) => {
            if (rows.length > 0) {
                return rows.map((row) => PostRepositoryPostgresFactory.create(row));
            }
            return [];
        });
    }
}

export class PostRepositoryPostgresFactory {
    static create(row: Row): Post {
        return new Post(
            row.id,
            row.user_id,
            row.title,
            row.slug,
            row.description,
            row.message,
            row.command,
            row.username,
            {
                like: row.like,
                dislike: row.dislike,
            },
            row.published_at,
            row.created_at,
            row.updated_at,
        );
    }
}
