import { NextFunction, Response } from 'express';
import CreateTipsUseCase from '../../domain/use_cases/createTipsUseCase';
import InputTips from '../../domain/models/inputTips';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';

export default class TipsController {
    constructor(private readonly _createTipsUseCase: CreateTipsUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Tips
     *   description: Register a tips
     * /tips:
     *   post:
     *     summary: Create a new tips
     *     tags: [Tips]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InputTips'
     *     responses:
     *       201:
     *         description: The created tips.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tips'
     *       400:
     *          description: Bad request
     *       500:
     *         description: Some server errors
     *
     */
    public async create(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const user_id = 2;
            const inputTips = new InputTips(req.body.title, req.body.command, req.body.description, user_id);
            const data = await this._createTipsUseCase.create(inputTips);
            return res.status(201).send({
                data: data,
            });
        } catch (err) {
            next(err);
        }
    }
}
