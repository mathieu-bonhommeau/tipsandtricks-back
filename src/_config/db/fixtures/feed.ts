import process from "process";

export class FeedDb {
    private _pg: Sql;

    get pg(): postgres.Sql {
        return this._pg;
    }

    async init(): Promise<void> {
        this._pg = postgres({
            host: process.env.PGHOST || '127.0.0.1', // Postgres ip address[s] or domain name[s]
            port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5433, // Postgres server ports[s]
            database: process.env.PGDB || 'tipsandtricks', // Name of database to connect to
            username: process.env.PGUSER || 'ttuser', // Username of database user
            password: process.env.PGPASSWORD || 'changeme', // Username of database
            ssl: process.env.ENVIRONMENT === 'production',
        });
    }
}
