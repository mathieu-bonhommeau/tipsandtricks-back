import { MigrationProcessor } from '../business/ports/migration-processor'
import fs from 'fs'
import path from 'path'
import { Sql } from 'postgres'

export class PostgresMigrationProcessor implements MigrationProcessor {
    constructor(private readonly _pg: Sql) {}
    async migrationUp(): Promise<void> {
        const sqlFiles: { schema: string[] } = {
            schema: fs.readdirSync(path.join(__dirname, '../../../../mcd/migrations/up')),
        }
        for (const [type, files] of Object.entries(sqlFiles)) {
            await this.playSqlQueries(type, files)
        }
    }

    async migrationDown(): Promise<void> {}

    async playSqlQueries(type: string, files: string[]): Promise<void> {
        for (const file of files) {
            await this._pg.file(path.join(__dirname, `./migrations/${type}/${file}`))
            await this._pg`insert into `
        }
    }
}
