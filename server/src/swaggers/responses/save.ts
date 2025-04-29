
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
 * 
 *    SaveResponse:
 *       description: Save Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/SaveGetComponents'
 */
