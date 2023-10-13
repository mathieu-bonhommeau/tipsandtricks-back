import Tips from '../../domain/models/Tips';
import { Row, Sql } from 'postgres';
import TipsRepositoryInterface, { TipsList } from '../../domain/ports/tipsRepositoryInterface';
import InputTips from '../../domain/models/inputTips';

export default class TipsRepositoryPostgres implements TipsRepositoryInterface {
    constructor(private readonly _sql: Sql) {}

    async create(input: InputTips): Promise<Tips | null> {
        return this._sql`insert into "tips" ${this._sql(
            input,
        )} returning id, user_id, title, command, description, published_at, created_at, updated_at`.then((rows) => {
            if (rows.length > 0) {
                return TipsRepositoryPostgresFactory.create(rows[0]);
            }
            return null;
        });
    }

    async getList(page: number, length: number): Promise<TipsList> {
        const start = length * (page - 1);

        const total = await this._sql`select count(*) as total from "tips"`.then((rows) => {
            return rows[0].total;
        });

        const tips = await this._sql`select * from "tips" offset ${start} limit ${length}`.then((rows) => {
            if (rows.length > 0) {
                return rows.map((row) => TipsRepositoryPostgresFactory.create(row));
            }
            return [];
        });

        return { tips, total } as TipsList;
    }
}

export class TipsRepositoryPostgresFactory {
    static create(row: Row): Tips {
        return new Tips(
            row.id,
            row.user_id,
            row.title,
            row.command,
            row.description,
            row.published_at,
            row.created_at,
            row.updated_at,
        );
    }
}
