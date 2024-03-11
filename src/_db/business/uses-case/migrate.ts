import { MigrationProcessor } from '../ports/migration-processor'
export class Migrate {
    private readonly _migrationProcessor: MigrationProcessor
    private readonly _migrationFileRead: MigrationFileRead

    constructor({
        migrationProcessor,
        migrationFileRead,
    }: {
        migrationProcessor: MigrationProcessor
        migrationFileRead: MigrationFileRead
    }) {
        this._migrationProcessor = migrationProcessor
        this._migrationFileRead = migrationFileRead
    }

    async up() {
        const migrationsPlayed = await this._migrationProcessor.all()
        const files = await this._migrationFileRead.get()

        migrationsPlayed.map

        await this._migrationProcessor.migrationUp(filesToPlay)
    }

    async down() {
        await this._migrationProcessor.migrationDown()
    }
}

export interface MigrationFileRead {
    get(): Promise<string[]>
}
