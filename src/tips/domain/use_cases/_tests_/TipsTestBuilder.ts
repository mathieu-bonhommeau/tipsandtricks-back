import Tips from '../../models/Tips';
import * as dotenv from 'dotenv';
import InputTips from '../../models/inputTips';
dotenv.config();

export default class TipsTestBuilder {
    private readonly _id: number | null = 1;
    private _user_id: number = 1;
    private _title: string = 'Un superbe tips !';
    private _command: string = 'npm run dev';
    private _description: string = 'Vraiment super !';

    private readonly _published_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _created_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _updated_at: Date | null = null;

    buildTips(): Tips {
        return new Tips(
            this._id,
            this._user_id,
            this._title,
            this._command,
            this._description,
            this._published_at,
            this._created_at,
            this._updated_at,
        );
    }

    buildInputTips(): InputTips {
        return new InputTips(this._title, this._command, this._description, this._user_id);
    }

    withTitle(title: string): TipsTestBuilder {
        this._title = title;
        return this;
    }

    withCommand(command: string): TipsTestBuilder {
        this._command = command;
        return this;
    }

    withDescription(description: string): TipsTestBuilder {
        this._description = description;
        return this;
    }
}
