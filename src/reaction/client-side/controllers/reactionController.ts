import { ReactionOnPostUseCaseInterface } from '../../domain/uses_case/reactionOnPostUseCase';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { Response, NextFunction } from 'express';
import InputReaction from '../../domain/model/inputReaction';

export default class ReactionController {
    constructor(private readonly _reactionOnPostUseCase: ReactionOnPostUseCaseInterface) {}

    public async reactionOnPost(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const inputReaction: InputReaction = new InputReaction(
                parseInt(req.params.postId) || null,
                req.user.id || null,
                req.body.reaction ? req.body.reaction : null,
            );

            const response = await this._reactionOnPostUseCase.reactionOnPost(inputReaction);

            if (response === null) return res.status(204).send();
            return res.status(201).send(response);
        } catch (err) {
            next(err);
        }
    }

    public async getReactionForCurrentUser(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const postId = parseInt(req.params.postId);

            const response = await this._reactionOnPostUseCase.getReactionForCurrentUser(userId, postId);

            if (response === null) return res.status(204).send();
            return res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    }
}
