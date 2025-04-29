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
 *     UserResponse:
 *       description: User Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/UserGetComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ProjectResponse:
 *       description: Project Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/ProjectBaseComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     InterestResponse:
 *       description: Interest Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/InterestBaseComponents'
 */
/**
 * @swagger
 * components:
 *   responses:
 *     ExperienceResponse:
 *       description: Experience Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/ExperienceBaseComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     EducationResponse:
 *       description: Education Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/EducationBaseComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     AddressResponse:
 *       description: Address Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/AddressBaseComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ConnectionResponse:
 *       description: Address Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/ConnectionBaseComponents'
 */

