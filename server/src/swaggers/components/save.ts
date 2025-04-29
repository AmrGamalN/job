/**
 * @swagger
 * components:
 *   schemas:
 *     SaveGetComponents:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Document unique ID
 *         actorId:
 *           type: string
 *           description: User Id
 *         actorType:
 *           type: string
 *           description: Item model that initiated the save
 *           enum: ["user", "company", "school", "group", "post", "job"]
 *         targetId:
 *           type: string
 *           description: Target item ID
 *         targetType:
 *           type: string
 *           description: Item model that is being saved
 *           enum: ["user", "company", "school", "group", "post", "job"]
 *         redirectUrl:
 *           type: string
 *           description: Redirect URL of the saved item
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Document creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Document update timestamp
 * 
 *     SaveAddComponents:
 *       type: object
 *       properties:
 *         actorType:
 *           type: string
 *           description: Item model initiating the save
 *           enum: ["user", "company", "school", "group", "post", "job"]
 *         targetId:
 *           type: string
 *           description: Target item ID
 *         targetType:
 *           type: string
 *           description: Item model that is being saved
 *           enum: ["user", "company", "school", "group", "post", "job"]
 *         redirectUrl:
 *           type: string
 *           description: Redirect URL of the saved item
 */
