import { Migrations } from '@modules/_db/business/model/migration'

export interface MigrationProcessor {
    all(): Promise<Migrations>
    migrationUp(filesToPlay: string[]): Promise<void>
    migrationDown(): Promise<void>
}
