export default class InputTips {
    constructor(
        public title: string,
        public command: string,
        public description: string | null,
        public user_id: number,
    ) {}
}
