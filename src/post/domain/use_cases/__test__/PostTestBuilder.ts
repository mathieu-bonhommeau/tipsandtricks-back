import * as dotenv from 'dotenv';
import Post from '../../model/post';
import InputPost from '../../model/inputPost';
dotenv.config();

export default class PostTestBuilder {
    private _id: number | null = 1;
    private _user_id: number = 1;
    private _title: string = 'Un superbe post !';
    private _command: string = 'npm run dev';
    private _slug: string = 'un-superbe-post';
    private _message: string = 'mon message !';
    private _description: string = 'Vraiment super !';
    private _username: string = 'username';

    private readonly _published_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _created_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _updated_at: Date | null = null;

    buildPost(): Post {
        return new Post(
            this._id,
            this._user_id,
            this._title,
            this._command,
            this._description,
            this._slug,
            this._message,
            this._username,
            this._published_at,
            this._created_at,
            this._updated_at,
        );
    }

    buildInputPost(): InputPost {
        return new InputPost(this._title, this._slug, this._message, this._command, this._description, this._user_id);
    }

    withTitle(title: string): PostTestBuilder {
        this._title = title;
        return this;
    }

    withCommand(command: string): PostTestBuilder {
        this._command = command;
        return this;
    }

    withDescription(description: string): PostTestBuilder {
        this._description = description;
        return this;
    }

    withSlug(slug: string): PostTestBuilder {
        this._slug = slug;
        return this;
    }

    withMessage(message: string): PostTestBuilder {
        this._message = message;
        return this;
    }

    withUserId(userId: number): PostTestBuilder {
        this._user_id = userId;
        return this;
    }

    withUsername(username: string): PostTestBuilder {
        this._username = username;
        return this;
    }
}
