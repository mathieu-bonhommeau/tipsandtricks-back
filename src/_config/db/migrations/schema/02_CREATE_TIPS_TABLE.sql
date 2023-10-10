CREATE TABLE IF NOT EXISTS "tips" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user",
    "title" VARCHAR NOT NULL,
    "command" TEXT NOT NULL,
    "description" TEXT NULL,
    "published_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "updated_at" TIMESTAMPTZ NULL
)