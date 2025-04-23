/**
 * @swagger
 * components:
 *   parameters:
 *     Id:
 *      name: id
 *      in: path
 *      required: false
 *      description: Enter id
 *      schema:
 *        type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserId:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID
 *       required: false
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     Page:
 *       name: page
 *       in: query
 *       description: The page number
 *       schema:
 *         type: integer
 *         default: 1
 *     Limit:
 *       name: limit
 *       in: query
 *       description: The number of items to return
 *       schema:
 *         type: integer
 *         default: 10
 */

//#region  [user folder]
/**
 * @swagger
 * components:
 *   schemas:
 *     UserUpdateComponents:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: The user user name
 *         firstName:
 *           type: string
 *           description: The user job firstName
 *         lastName:
 *           type: string
 *           description: The user lastName
 *         profileImage:
 *           type: object
 *           properties:
 *             imageUrl:
 *               type: string
 *               description: The user profile image url
 *             imageKey:
 *               type: string
 *               description: The user profile image key
 *         coverImage:
 *           type: object
 *           properties:
 *             imageUrl:
 *               type: string
 *               description: The user cover image url
 *             imageKey:
 *               type: string
 *               description: The user cover image key
 *         linkedIn:
 *           type: string
 *           description: The user linkedIn
 *         github:
 *           type: string
 *           description: The user github
 *         website:
 *           type: string
 *           description: The user website
 *         visibility:
 *           type: string
 *           description: The user account
 *           enum: ["connection", "public", "private"]
 *           default: "connection"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SecurityUpdateComponents:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "usr_123"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+201001112233"
 *         password:
 *           type: string
 *           format: password
 *           example: "StrongPassword123!"
 *         role:
 *           type: string
 *           enum: [user, admin, manager]
 *           default: user
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: inactive
 *         isEmailVerified:
 *           type: boolean
 *           default: false
 *         isPasswordReset:
 *           type: boolean
 *           default: false
 *         isAccountBlocked:
 *           type: boolean
 *           default: false
 *         isAccountDeleted:
 *           type: boolean
 *           default: false
 *         isTwoFactorAuth:
 *           type: boolean
 *           default: false
 *         twoFactorCode:
 *           type: string
 *           default: ""
 *         numberLogin:
 *           type: number
 *           default: 0
 *         lastFailedLoginTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         dateToJoin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         sign_up_provider:
 *           type: string
 *           default: ""
 *         sign_in_provider:
 *           type: string
 *           default: ""
 *         terms:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileUpdateComponents:
 *       type: object
 *       properties:
 *         about:
 *           type: string
 *           description: The user about
 *         jobTitle:
 *           type: string
 *           description: The user job title
 *         jobDescription:
 *           type: string
 *           description: The user job description
 *         jobLocation:
 *           type: string
 *           description: The user job location
 *         jobCompany:
 *           type: string
 *           description: The user job company
 *         jobType:
 *           type: string
 *           description: The user job type
 *           enum: ["full-time", "part-time", "freelance", ""]
 *           default: ""
 *         projectPreference:
 *           type: string
 *           description: The user project preference
 *           enum: ["Long-term", "Short-term", "both", ""]
 *           default: ""
 *         experienceLevel:
 *           type: string
 *           description: The user experience level
 *           enum: ["entry-level", "Intermediate", "expert", ""]
 *           default: ""
 *         categories:
 *           type: array
 *           description: The user categories
 *           items:
 *             type: string
 *         skills:
 *           type: array
 *           description: The user skills
 *           items:
 *             type: string
 *         languages:
 *           type: array
 *           description: The user languages
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 description: The user language
 *               level:
 *                 type: string
 *                 description: The user level
 *                 enum: ["beginner", "intermediate", "advanced", "fluent"]
 *                 default: fluent
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectBaseComponents:
 *       type: object
 *       required:
 *         - projectName
 *         - companyName
 *         - description
 *         - status
 *         - technologies
 *         - startDate
 *         - endDate
 *         - projectUrl
 *         - repositoryUrl
 *       properties:
 *         projectName:
 *           type: string
 *           example: "AI Resume Builder"
 *           description: "Name of the project"
 *         companyName:
 *           type: string
 *           example: "TechStars Inc."
 *           description: "Company or organization name"
 *         description:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           example: "This project automates resume generation using AI."
 *           description: "Brief overview of the project"
 *         status:
 *           type: string
 *           enum: [active, completed, pending, archived]
 *           default: active
 *           example: "active"
 *           description: "Current status of the project"
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Node.js", "React", "MongoDB"]
 *           description: "Technologies used in the project"
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *           description: "Start date of the project"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2023-06-01"
 *           description: "End date of the project"
 *         projectUrl:
 *           type: string
 *           format: uri
 *           example: "https://example.com/project"
 *           description: "Live project URL"
 *         repositoryUrl:
 *           type: string
 *           format: uri
 *           example: "https://github.com/username/project"
 *           description: "Link to the source code repository"
 *         attachment:
 *           type: string
 *           format: uri
 *           example: "https://github.com/username/project"
 *           description: "Link to the source code repository"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InterestBaseComponents:
 *       type: object
 *       properties:
 *         industries:
 *           type: array
 *           items:
 *             type: string
 *           description: List of related industries
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 *         hobbies:
 *           type: array
 *           items:
 *             type: string
 *           description: List of related hobbies
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 *         influencers:
 *           type: array
 *           items:
 *             type: string
 *           description: List of influencers the user follows
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 *         companies:
 *           type: array
 *           items:
 *             type: string
 *           description: List of companies the user is interested in
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 *         groups:
 *           type: array
 *           items:
 *             type: string
 *           description: List of groups the user is a member of or interested in
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ExperienceBaseComponents:
 *       type: object
 *       required:
 *         - companyName
 *         - jobTitle
 *         - description
 *         - employmentType
 *         - location
 *         - locationType
 *         - startDate
 *         - endDate
 *         - currentlyWorking
 *       properties:
 *         companyName:
 *           type: string
 *           description: Company name
 *           example: "Tech Solutions Ltd"
 *         jobTitle:
 *           type: string
 *           description: Job title
 *           example: "Frontend Developer"
 *         description:
 *           type: string
 *           description: Job description
 *           example: "Developed UI components for a React app"
 *         employmentType:
 *           type: string
 *           description: Type of employment
 *           enum:
 *             - full-time
 *             - part-time
 *             - internship
 *             - freelance
 *             - self-employed
 *             - seasonal
 *             - apprenticeship
 *             - contract
 *           example: "full-time"
 *         location:
 *           type: string
 *           description: Work location (city or address)
 *           example: "Cairo, Egypt"
 *         locationType:
 *           type: string
 *           description: Location type
 *           enum:
 *             - remote
 *             - on-site
 *             - hybrid
 *           example: "remote"
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date
 *           example: "2022-01-01"
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date
 *           example: "2023-12-31"
 *         currentlyWorking:
 *           type: boolean
 *           description: Whether the user is currently working in this role
 *           example: false
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EducationBaseComponents:
 *       type: object
 *       required:
 *         - university
 *         - description
 *         - degree
 *         - major
 *         - startDate
 *         - endDate
 *         - gpa
 *       properties:
 *         university:
 *           type: string
 *           description: University name
 *           example: Cairo University
 *         description:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           description: Description of the education
 *           example: Studied computer science and software engineering.
 *         degree:
 *           type: string
 *           description: Degree achieved
 *           example: Bachelor's
 *         major:
 *           type: string
 *           description: Major subject
 *           example: Computer Science
 *         startDate:
 *           type: date
 *           format: date
 *           description: Start date
 *           example: 2018-09-01
 *         endDate:
 *           type: date
 *           format: date
 *           description: End date
 *           example: 2022-07-01
 *         gpa:
 *           type: number
 *           minLength: 1
 *           maxLength: 5
 *           description: Grade Point Average
 *           example: 3.8
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddressBaseComponents:
 *       type: object
 *       properties:
 *         country:
 *           type: string
 *           description: The user country
 *         city:
 *           type: string
 *           description: The user city
 *         state:
 *           type: string
 *           description: The user state
 *         address:
 *           type: string
 *           description: The user address
 *         timeZone:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ConnectionBaseComponents:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID associated with the connection.
 *         connectorId:
 *           type: string
 *           description: The connector (other user) ID for the connection.
 *         status:
 *           type: string
 *           enum: ["pending", "accepted", "blocked", "unBlocked"]
 *           description: The current status of the connection.
 *         acceptedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the connection was accepted.
 *         blockedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the connection was blocked.
 *         unBlockedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the connection was unblocked.
 *         history:
 *           type: object
 *           properties:
 *             action:
 *               type: string
 *               enum: ["blocked", "unBlocked", "accepted"]
 *               nullable: true
 *               description: The action that took place (e.g., blocked, accepted, etc.).
 *             actionBy:
 *               type: string
 *               nullable: true
 *               description: The user who performed the action.
 *             actionAt:
 *               type: string
 *               format: date-time
 *               nullable: true
 *               description: The time when the action occurred.
 *       required:
 *         - userId
 *         - connectorId
 */

//#endregion

//#region [ post folder ]
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

//#endregion

//#region [ auth folder ]

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginEmailComponents:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: amr5189520@gmail.com
 *         password:
 *           type: string
 *           example: 01200812638Amr@
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginPhoneComponents:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: +201200812637
 *         password:
 *           type: string
 *           example: 01200812638Amr@
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Login2FAComponents:
 *       type: object
 *       properties:
 *         twoFactorCode:
 *           type: string
 *           example: 123456
 *           description: The code that was sent to your 2FA device
 */

//#endregion
