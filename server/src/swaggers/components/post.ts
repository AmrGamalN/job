/**
 * @swagger
 * components:
 *   schemas:
 *     ReactionBaseComponents:
 *       type: object
 *       required:
 *         - userId
 *         - postId
 *         - reactionType
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId of the reaction (optional when creating)
 *           example: "661f1edbbd0b62ad3e6e8b1e"
 *         userId:
 *           type: string
 *           description: The ID of the user reacting
 *           example: "661f1ccebd0b62ad3e6e8a9f"
 *         postId:
 *           type: string
 *           description: The ID of the post being reacted to
 *           example: "661f1d8dbd0b62ad3e6e8af3"
 *         reactionType:
 *           type: string
 *           enum: [like, love, haha, wow, sad, angry]
 *           example: like
 *           description: Type of reaction
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date the reaction was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date the reaction was last updated
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentGetComponents:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "661f0871e4f546d1a9c5ad78"
 *         userId:
 *           type: string
 *           example: "user_123"
 *         actorType:
 *           type: string
 *           enum: ["user", "company", "school", "group", "post", "job"]
 *           default: user
 *         postId:
 *           type: string
 *           example: "661f0850e4f546d1a9c5ad34"
 *         commentId:
 *           type: array
 *           items:
 *             type: string
 *           example: ["661f089be4f546d1a9c5ad99"]
 *         reactionId:
 *           type: array
 *           items:
 *             type: string
 *           example: ["661f089be4f546d1a9c5ad77"]
 *         content:
 *           type: string
 *           maxLength: 1000
 *           example: "This is a comment"
 *         media:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [image, video]
 *                 example: "image"
 *               url:
 *                 type: string
 *                 example: "https://example.com/image.png"
 *               key:
 *                 type: string
 *                 example: "uploads/image123.png"
 *         reactionCount:
 *           type: array
 *           items:
 *             type: number
 *           example: [5, 0, 2, 0, 1]
 *         isEdited:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-17T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-17T12:05:00Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentAddComponents:
 *       type: object
 *       required:
 *         - userId`
 *         - prefixS3
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: Main content of the comment
 *           example: "Just launched my new portfolio website"
 *         media:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - type
 *               - url
 *               - key
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [image, video, document]
 *                 example: "image"
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://s3.amazonaws.com/bucket/image.png"
 *               key:
 *                 type: string
 *                 example: "uploads/image.png"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PostAddComponents:
 *       type: object
 *       required:
 *         - userId
 *         - prefixS3
 *         - content
 *       properties:
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of mentioned user IDs
 *           example: ["643a5b2e8b9d2f001c8f4e5ee47cv21"]
 *         content:
 *           type: string
 *           description: Main content of the post
 *           example: "Just launched my new portfolio website"
 *         media:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - type
 *               - url
 *               - key
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [image, video, document]
 *                 example: "image"
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://s3.amazonaws.com/bucket/image.png"
 *               key:
 *                 type: string
 *                 example: "uploads/image.png"
 *         visibility:
 *           type: string
 *           enum: [public, connections, private]
 *           default: public
 *           example: "connections"
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["#nodejs", "#typescript"]
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PostGetComponents:
 *       type: object
 *       required:
 *         - userId
 *         - prefixS3
 *         - content
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user who created the post
 *           example: "643a5b2e8b9d2f001c8f4e5a"
 *         commentId:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *           description: Array of comment IDs
 *           example: ["643a5b2e8b9d2f001c8f4e5c"]
 *         reactionId:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *           description: Array of reaction IDs
 *           example: ["643a5b2e8b9d2f001c8f4e5d"]
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of mentioned user IDs
 *           example: ["643a5b2e8b9d2f001c8f4e5e"]
 *         prefixS3:
 *           type: string
 *           description: S3 prefix for media storage
 *           example: "user_uploads/posts/"
 *         content:
 *           type: string
 *           description: Main content of the post
 *           example: "Just launched my new portfolio website 🚀"
 *         media:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - type
 *               - url
 *               - key
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [image, video, document]
 *                 example: "image"
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://s3.amazonaws.com/bucket/image.png"
 *               key:
 *                 type: string
 *                 example: "uploads/image.png"
 *         shares:
 *           type: integer
 *           default: 0
 *           example: 3
 *         watch:
 *           type: integer
 *           default: 0
 *           example: 154
 *         visibility:
 *           type: string
 *           enum: [public, connections, private]
 *           default: public
 *           example: "connections"
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["#nodejs", "#typescript"]
 *         reactionCount:
 *           type: array
 *           items:
 *             type: integer
 *           example: [4, 0, 2, 1, 0]
 *         commentCount:
 *           type: number
 *           default: 0
 *           example: 150
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-12-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-12-02T12:00:00.000Z"
 */