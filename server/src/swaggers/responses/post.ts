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
 *     ReactionResponse:
 *       description: Reaction Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/ReactionBaseComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CommentResponse:
 *       description: Comment Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                   data:
 *                     $ref: '#/components/schemas/CommentGetComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     PostResponse:
 *       description: Post Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                   data:
 *                     $ref: '#/components/schemas/PostGetComponents'
 */
