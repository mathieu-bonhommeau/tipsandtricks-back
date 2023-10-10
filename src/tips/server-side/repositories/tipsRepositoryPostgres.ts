import Tips from '../../domain/models/Tips';
import { Row, Sql } from 'postgres';
import TipsRepositoryInterface from "../../domain/ports/tipsRepositoryInterface";

export default class TipsRepositoryPostgres implements TipsRepositoryInterface {
    constructor(private readonly _sql: Sql) {}

    async getList(username: string): Promise<Tips> {
        const rows = await this._sql`select * from "tips" LIMIT 14`;
        if (rows.length > 0) {
            return rows;
        }
        return null;
    }
}
