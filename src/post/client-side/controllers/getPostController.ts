import GetPostUseCase from '../../domain/use_cases/getPostUseCase';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { NextFunction, Response } from 'express';
import Post from '../../domain/model/post';

export default class GetPostController {
    constructor(private readonly _getPostUseCase: GetPostUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Posts
     *   description: Manages post app
     *   /posts?start=&length=:
     *   get:
     *     summary: Retrieve posts list
     *     parameters:
     *      - in: query
     *        name: start
     *        schema:
     *           type: integer
     *        description: The point which is use for start posts list.
     *      - in: query
     *        name: length
     *        schema:
     *           type: integer
     *        description: Determines the number of posts to recover.
     *     tags: [Post]
     *     responses:
     *       200:
     *         description: Post recovered.
     *         content:
     *          application/json:
     *              schema:
     *                  $ref: '#/components/schemas/Post'
     *       500:
     *         description: Some server errors
     *
     */
    public async getPost(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const postId = +req.params.postId;
            const post: Post | null = await this._getPostUseCase.getPost(postId);
            return res.status(200).send(post);
        } catch (err) {
            next(err);
        }
    }
}
