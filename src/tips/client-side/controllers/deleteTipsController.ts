import { NextFunction, Response } from 'express';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import DeleteTipsUseCase from '../../../tips/domain/use_cases/deleteUseCase';

export default class DeleteTipsController {
    constructor(private readonly _deleteTipsUseCase: DeleteTipsUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Tips
     *   description: Delete a tip
     * /tips/{tipId}:
     *   delete:
     *     summary: Delete a tip
     *     tags: [Tips]
     *     parameters:
     *       - in: path
     *         name: tipId
     *         required: true
     *         description: ID of the tip to delete
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Successfully deleted
     *       400:
     *         description: Bad request (e.g., tip not found)
     *       500:
     *         description: Some server errors
     *
     */
    public async delete(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const tipsId = parseInt(req.params.tipsId);
            const userId = req.user.id;
            if (isNaN(tipsId)) {
                return res.status(400).send({ message: 'Invalid tip ID' });
            }

            const deletedSuccessfully = await this._deleteTipsUseCase.delete(userId, tipsId);

            if (deletedSuccessfully) {
                return res.status(200).send({
                    message: 'Tips deleted successfully.',
                });
            } else {
                return res.status(400).send({ message: 'Tips not found' });
            }
        } catch (err) {
            next(err);
        }
    }
}
