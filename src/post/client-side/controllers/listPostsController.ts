import ListPostUseCase from "../../domain/use_cases/listPostsUseCase";
import InfiniteInput from "../../../_common/domain/models/infiniteInput";
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { NextFunction, Response } from 'express';
import InfiniteResponse from "../../../_common/domain/models/infiniteResponse";
import Post from "../../domain/model/post";

export default class ListPostsController {
    constructor(private readonly _listPostsUseCase: ListPostUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Posts
     *   description: Manages tips app
     * /tips?page=&length=:
     *   get:
     *     summary: Retrieve tips list
     *     parameters:
     *      - in: query
     *        name: page
     *        schema:
     *           type: integer
     *        description: The page for which tips are retrieved.
     *      - in: query
     *        name: length
     *        schema:
     *           type: integer
     *        description: Determines the number of tips to recover.
     *     tags: [Tips]
     *     responses:
     *       200:
     *         description: Tips recovered.
     *         content:
     *          application/json:
     *              schema:
     *                  $ref: '#/components/schemas/Tips'
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server errors
     *
     */
    public async postsList(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const infiniteInput = new InfiniteInput(
                req.query.start ? +req.query.start : 0,
                req.query.length ? +req.query.length : 20,
            );

            const infiniteResponse: InfiniteResponse<Post> = await this._listPostsUseCase.getList(
                infiniteInput,
            );

            return res.status(200).send(infiniteResponse);
        } catch (err) {
            next(err);
        }
    }
}