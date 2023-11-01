export enum ReactionType {
    like = 'like',
    dislike = 'dislike',
}
export default class Reaction {
    constructor(
        public readonly post_id: number,
        public readonly user_id: number,
        public readonly reaction: ReactionType | null,
    ) {}
}

export type UserReactionWithLikesDislikes = {
    reaction: Reaction | null;
    likes: number;
    dislikes: number;
};
