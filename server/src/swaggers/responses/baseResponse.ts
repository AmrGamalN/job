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
 *          enum: [ "Ok", "Created", "BadRequest", "NotFound", "Conflict", "Unauthorized", "InternalServerError" ]
 *        status:
 *          type: number
 *          enum: [200, 201, 400, 404, 409, 401, 500]
 *        success:
 *          type: boolean
 *          enum: [true, false]
 *        message:
 *          type: string
 */
