import PostRepositoryInterface from '../domain/ports/postRepositoryInterface';
import Post from '../domain/model/post';
import { Row, Sql } from 'postgres';

export default class PostRepositoryPostgres implements PostRepositoryInterface {
    constructor(private readonly _sql: Sql) {}

    async getList(start: number, length: number): Promise<Post[]> {
        return await this._sql`
            select p.*, u.username
            from "post" p
                     join "user" u on u."id" = p."user_id"
            order by p."id"
            offset ${start}
            limit ${length}`.then((rows) => {
            console.log(rows);
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
            row.published_at,
            row.created_at,
            row.updated_at,
        );
    }
}
