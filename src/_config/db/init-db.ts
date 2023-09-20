import postgres, { Sql } from 'postgres'
import * as dotenv from 'dotenv'
import * as process from 'process'
import * as fs from 'fs'
import * as path from 'path'
dotenv.config()

export class InitDb {
    private _pg: Sql

    get pg(): postgres.Sql {
        return this._pg
    }

    async init(): Promise<void> {
        this._pg = postgres({
            host: process.env.PGHOST || '127.0.0.1', // Postgres ip address[s] or domain name[s]
            port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5433, // Postgres server port[s]
            database: process.env.PGDB || 'tipsandtricks', // Name of database to connect to
            username: process.env.PGUSER || 'ttuser', // Username of database user
            password: process.env.PGPASSWORD || 'changeme', // Username of database user
        })
    }

    async readFiles(): Promise<void> {
        const sqlFiles: { schema: string[] } = {
            schema: fs.readdirSync(path.join(__dirname, './migrations/schema')),
        }

        for (const [type, files] of Object.entries(sqlFiles)) {
            await this.playSqlQueries(type, files)
        }
    }

    async playSqlQueries(type: string, files: string[]): Promise<void> {
        for (const file of files) {
            await this._pg.file(path.join(__dirname, `./migrations/${type}/${file}`))
        }
    }

    async clearDb() {
        const __dirname = path.dirname(__filename)
        return this._pg.file(path.join(__dirname, `./migrations/drop_db.sql`))
    }
}

(async () => {
    const init = new InitDb()
    await init.init()
    await init.clearDb()
    await init.readFiles()
    await init.pg.end()
})()
