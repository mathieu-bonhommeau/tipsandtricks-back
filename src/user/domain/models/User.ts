export enum Roles {
    admin = 'admin',
    moderator = 'moderator',
}
export default class User {
    constructor(
        public id: number,
        public email: string,
        public username: string,
        public roles: Roles | null,
        public created_at: Date,
        public updated_at: Date | null,
    ) {}
}

export class JwtToken {
    constructor(
        public access_token: string,
        public refresh_token: string
    ) {}
}

export class UserLogged {
    constructor(
        public user: User,
        public tokens: JwtToken
    ) {}

}
