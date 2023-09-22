export default class InputError extends Error {
    private _statusCode: number = 400;
    constructor(public message: string) {
        super();
    }

    get statusCode(): number {
        return this._statusCode;
    }
}
