/**
 * @swagger
 * components:
 *   schemas:
 *    BaseResponse:
 *      description: Successful operation
 *      type: object
 *      properties:
 *        statusText:
 *          type: string
 *        status:
 *          type: number
 *        success:
 *          type: boolean
 *        message:
 *          type: string
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ProfileResponse:
 *       description: Get profile Successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ProfileUpdateComponents'
 */
