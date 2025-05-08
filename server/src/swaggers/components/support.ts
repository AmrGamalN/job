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
 *         userId:
 *           type: string
 *           description: User Id
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

/**
 * @swagger
 * components:
 *   schemas:
 *     ReportGetComponents:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Document unique ID
 *         userId:
 *           type: string
 *           description: User Id
 *         targetId:
 *           type: string
 *           description: Target item ID
 *         reviewedBy:
 *           type: string
 *           description: Reviewed by
 *         targetType:
 *           type: string
 *           description: Target type of report
 *           enum: ["user", "company", "school", "group", "post", "job","school","other"]
 *         status:
 *           type: string
 *           description: Status of the report
 *           enum: ["pending", "reviewed", "dismissed"]
 *         subject:
 *           type: string
 *           description: Subject of the report
 *         message:
 *           type: string
 *           description: Message of the report
 *         reviewMessage:
 *           type: string
 *           description: Review message of the report
 *         reviewedAt:
 *           type: string
 *           format: date-time
 *           description: Review timestamp
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Document creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Document update timestamp
 *
 *     ReportAddComponents:
 *       type: object
 *       required:
 *         - targetId
 *         - targetType
 *         - subject
 *         - message
 *       properties:
 *         targetId:
 *           type: string
 *           description: Target item ID
 *         targetType:
 *           type: string
 *           description: Target type of report
 *           enum: ["user", "company", "school", "group", "post", "job","school","other"]
 *         subject:
 *           type: string
 *           description: Subject of the report
 *         message:
 *           type: string
 *           description: Message of the report
 *
 *     ReportUpdateComponents:
 *       type: object
 *         - status
 *         - reviewMessage
 *       properties:
 *         status:
 *           type: string
 *           description: Status of the report
 *           enum: ["pending", "reviewed", "dismissed"]
 *         reviewMessage:
 *           type: string
 *           description: Review message of the report
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     HelpGetComponents:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the help request
 *         userId:
 *           type: string
 *           description: ID of the user who submitted the help request
 *         subject:
 *           type: string
 *           description: Subject/title of the help request
 *         message:
 *           type: string
 *           description: Detailed message of the help request
 *         status:
 *           type: string
 *           description: Status of the help request
 *           enum: [pending, reviewed, resolved]
 *         reviewedBy:
 *           type: string
 *           description: ID of the reviewer (if reviewed)
 *         reviewMessage:
 *           type: string
 *           description: Message written by the reviewer
 *         reviewedAt:
 *           type: string
 *           format: date-time
 *           description: When the request was reviewed
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the help request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last time the help request was updated
 *
 *     HelpAddComponents:
 *       type: object
 *       required:
 *         - subject
 *         - message
 *       properties:
 *         subject:
 *           type: string
 *           description: Subject/title of the help request
 *         message:
 *           type: string
 *           description: Detailed message of the help request
 *
 *     HelpUpdateComponents:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, reviewed, resolved]
 *           description: New status of the help request
 *         reviewMessage:
 *           type: string
 *           description: Message written by the reviewer
 */
