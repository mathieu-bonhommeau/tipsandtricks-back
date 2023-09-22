export enum Roles {
    admin = 'admin',
    moderator = 'moderator',
}
export default class User {
    constructor(
        private readonly id: number,
        private readonly email: string,
        private readonly username: string,
        private readonly roles: Roles | null,
        private readonly created_at: Date,
        private readonly updated_at: Date | null,
    ) {}
}
