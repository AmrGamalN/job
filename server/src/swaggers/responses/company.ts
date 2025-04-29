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
 *     CompanyResponse:
 *       description: Company Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/CompanyGetComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     MemberResponse:
 *       description: Member Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/MemberGetComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CertificateResponse:
 *       description: Certificate Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/CertificateGetComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     FaqResponse:
 *       description: FAQ Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/FaqGetComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     FeedBackResponse:
 *       description: FeedBack Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/FeedBackGetComponents'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     DocumentResponse:
 *       description: Document Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/DocumentGetComponents'
 */
