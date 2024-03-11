import { Migrations } from '@modules/_db/business/model/migration'
import { MigrationProcessor } from '@modules/_db/business/ports/migration-processor'
import postgres from 'postgres'
import { Migrate } from '@modules/_db/business/uses-case/migrate'

describe('A migration use case', () => {
    let sut: SUT

    beforeEach(() => {
        sut = new SUT()
    })

    const migrations: Migrations = [
        {
            id: '7d4cdc6d-c495-4169-a1a9-3800e46ae21a',
            migrationName: 'first_migration',
            createdAt: new Date('2024-03-08'),
        },
        {
            id: '08310c8b-10ea-4ef2-983d-098a685dc970',
            migrationName: 'second_migration',
            createdAt: new Date('2024-03-09'),
        },
    ]

    it('execute all migrations if database is empty', async () => {
        sut.givenMigrations(migrations)
        await sut.migrationsUp()

        expect(await sut.getMigrationPlayed()).toEqual(migrations)
    })
})

class SUT {
    private readonly _migrationProcessor: InMemoryMigrationProcessor
    private _migrate: Migrate
    constructor() {
        this._migrationProcessor = new InMemoryMigrationProcessor()
        this._migrate = new Migrate({
            migrationProcessor: this._migrationProcessor,
        })
    }
    givenMigrations(migrations: Migrations) {
        this._migrationProcessor.migrations = migrations
    }

    async migrationsUp() {
        await this._migrate.up()
    }
}

export class InMemoryMigrationProcessor implements MigrationProcessor {
    private _migrations: Migrations = []
    migrationUp(): Promise<void> {
        return Promise.resolve(undefined)
    }
    migrationDown(): Promise<void> {
        return Promise.resolve(undefined)
    }

    set migrations(value: Migrations) {
        this._migrations = value
    }
}
