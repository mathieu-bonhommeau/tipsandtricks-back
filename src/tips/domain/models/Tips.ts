export default class Tips {
    constructor(
        public id: number,
        public user_id: number,
        public title: string,
        public command: string,
        public description: string | null,
        public published_at: Date,
        public created_at: Date,
        public updated_at: Date | null,
    ) {}
}