export type Migrations = Migration[];

export type Migration = {
  id: string;
  migrationName: string;
  createdAt: Date;
};
