import { NextFunction, Response } from 'express';
import CreateTipsUseCase from '../../domain/use_cases/createTipsUseCase';
import InputTips from '../../domain/models/inputTips';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import UpdateTipsUseCase from "../../domain/use_cases/updateTipsUseCase";

export default class updateTipsController {
    constructor(private readonly _updateTipsUseCase: UpdateTipsUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Tips
     *   description: Update an existing tip
     * /tips/{tipsId}:
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
    public async update(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const tipsId : number | null = req.params.tipsId ? +req.params.tipsId : null;
            const description: string | null = req.body.description === '' ? null : req.body.description;

            const inputTips = new InputTips(req.body.title, req.body.command, description, req.user.id);
            const data = await this._updateTipsUseCase.update(tipsId, req.user.id, inputTips);
            return res.status(200).send({
                data: data,
            });
        } catch (err) {
            next(err);
        }
    }
}
