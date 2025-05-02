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
 *             url:
 *               type: string
 *               description: The user profile image url
 *             key:
 *               type: string
 *               description: The user profile image key
 *         coverImage:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               description: The user cover image url
 *             key:
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
 *           enum: ["full_time", "part_time", "freelance", ""]
 *           default: ""
 *         projectPreference:
 *           type: string
 *           description: The user project preference
 *           enum: ["Long-term", "Short-term", "both", ""]
 *           default: ""
 *         experienceLevel:
 *           type: string
 *           description: The user experience level
 *           enum: ["entry_level", "Intermediate", "expert", ""]
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
 *             - full_time
 *             - part_time
 *             - internship
 *             - freelance
 *             - seasonal
 *             - apprenticeship
 *             - contract
 *           example: "full_time"
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
 *         actorId:
 *          type: string
 *          description: The ID of the user who owns the connection.
 *         ownerType:
 *           type: string
 *           description: The type of owner associated with the connection.
 *           enum: ["user", "company", "school"]
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
