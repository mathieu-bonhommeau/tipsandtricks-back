import postgres, { Sql } from 'postgres';
import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

async function initDb(): Promise<Sql> {
    return postgres({
        host: process.env.PGHOST || '127.0.0.1', // Postgres ip address[s] or domain name[s]
        port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5433, // Postgres server ports[s]
        database: process.env.PGDB || 'tipsandtricks', // Name of database to connect to
        username: process.env.PGUSER || 'ttuser', // Username of database user
        password: process.env.PGPASSWORD || 'changeme', // Username of database
        ssl: process.env.ENVIRONMENT === 'production',
    })}
