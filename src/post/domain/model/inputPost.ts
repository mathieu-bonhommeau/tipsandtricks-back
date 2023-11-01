export default class InputPost {
    constructor(
        public title: string,
        public slug: string,
        public message: string,
        public description: string | null,
        public command: string,
        public user_id: number,
    ) {}
}