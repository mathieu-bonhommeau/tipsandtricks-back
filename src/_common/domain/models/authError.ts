export default class AuthError extends Error {
    private _statusCode: number = 401;
    constructor(public message: string) {
        super();
    }

    get statusCode(): number {
        return this._statusCode;
    }
}
