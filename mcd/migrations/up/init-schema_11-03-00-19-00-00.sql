CREATE TABLE IF NOT EXISTS migrations (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "migration_name" varchar not null,
    "created_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL
);

CREATE TYPE roles AS ENUM ('admin', 'moderator');

CREATE TABLE IF NOT EXISTS "user" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "email" VARCHAR UNIQUE NOT NULL,
    "username" VARCHAR UNIQUE NOT NULL,
    "password" VARCHAR NOT NULL,
    "roles" roles NULL,
    "refresh_token" VARCHAR UNIQUE NULL,
    "created_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "updated_at" TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS "tips" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" uuid NOT NULL,
    "title" VARCHAR NOT NULL,
    "command" TEXT NOT NULL,
    "description" TEXT NULL,
    "published_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "updated_at" TIMESTAMPTZ NULL
);

ALTER TABLE "tips" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id")  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "post"
(
    "id"           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "title"        VARCHAR   NOT NULL,
    "slug"         VARCHAR   NOT NULL,
    "command"      TEXT      NOT NULL,
    "description"  TEXT      NULL,
    "message"      TEXT      NULL,
    "user_id"      INTEGER NOT NULL,
    "published_at" TIMESTAMPTZ        DEFAULT current_timestamp NOT NULL,
    "created_at"   TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "updated_at"   TIMESTAMP NULL
);

ALTER TABLE "post" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP TYPE IF EXISTS reaction_enum;
CREATE TYPE reaction_enum AS ENUM ('like', 'dislike');

CREATE TABLE IF NOT EXISTS "reaction"
(
    "post_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "reaction" reaction_enum NOT NULL
);

ALTER TABLE "reaction"
    ADD PRIMARY KEY ("post_id", "user_id"),
    ADD FOREIGN KEY ("post_id") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
