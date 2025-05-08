/**
 * @swagger
 * components:
 *   schemas:
 *     JobGetComponents:
 *       type: object
 *       required:
 *         - _id
 *         - companyId
 *         - jobTitle
 *         - department
 *         - applicantTypes
 *         - jobType
 *         - workplaceType
 *         - jobDescription
 *         - jobRequirements
 *         - skills
 *         - email
 *         - status
 *         - createdBy
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         _id:
 *           type: string
 *           description: Job unique identifier
 *           example: "6615f82b7f9e1c6f792ac93b"
 *         companyId:
 *           type: string
 *           description: ID of the company posting the job
 *           example: "660aa927ff43b3a70e78fcbd"
 *         actorType:
 *           type: string
 *           description: Actor type, always "job"
 *           example: "job"
 *         jobTitle:
 *           type: string
 *           description: Job title
 *           example: "Senior Backend Developer"
 *         department:
 *           type: array
 *           items:
 *             type: string
 *           description: Departments this job belongs to
 *           example: ["Engineering", "Backend"]
 *         applicantTypes:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - student
 *               - graduate
 *               - joiner
 *               - entry_level
 *               - mid_level
 *               - senior
 *               - manager
 *               - executive
 *               - freelancer
 *               - intern
 *               - career_shifter
 *           description: Types of applicants allowed
 *         jobType:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - full_time
 *               - part_time
 *               - internship
 *               - freelance
 *               - seasonal
 *               - apprenticeship
 *               - contract
 *           description: Job engagement types
 *         jobExperience:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - fresh-grad
 *               - less-than-1-year
 *               - 1-2-years
 *               - 2-3-years
 *               - 3-4-years
 *               - 4-5-years
 *               - 5-6-years
 *               - 6-7-years
 *               - 7-8-years
 *               - 8-9-years
 *               - 9-10-years
 *           description: Experience range required for the job
 *           example: ["1-2-years", "2-3-years"]
 *         workplaceType:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - remote
 *               - on-site
 *               - hybrid
 *           description: Job location type
 *         jobDescription:
 *           type: string
 *           description: Full job description
 *           example: "Minimum 3 years in Node.js development and MongoDB."
 *         jobRequirements:
 *           type: string
 *           description: Full job requirements
 *           example: "Minimum 3 years in Node.js development and MongoDB."
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: List of required skills
 *           example: ["Node.js", "MongoDB", "Express"]
 *         location:
 *           type: string
 *           description: Physical location of the job
 *           example: "Cairo, Egypt"
 *         email:
 *           type: string
 *           description: Contact email
 *           example: "hr@example.com"
 *         createdBy:
 *           type: string
 *           description: The user who created the job
 *           example: "660aa927ff43b3a70e78fcbd"
 *         updatedBy:
 *           type: string
 *           description: The user who created the job
 *           example: "660aa927ff43b3a70e78fcbd"
 *         salary:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *               example: 1000
 *             max:
 *               type: number
 *               example: 3000
 *           description: Salary range for the position
 *         expireAt:
 *           type: string
 *           format: date-time
 *           description: Expiry date for the job posting
 *         viewsCount:
 *           type: number
 *           description: Number of times the job has been viewed
 *           example: 15
 *         jobLink:
 *           type: string
 *           description: External job link
 *           example: "https://jobs.example.com/backend-dev"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Job creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Job last update timestamp
 *
 *     JobAddComponents:
 *       type: object
 *       required:
 *         - jobTitle
 *         - department
 *         - applicantTypes
 *         - jobType
 *         - workplaceType
 *         - jobDescription
 *         - jobRequirements
 *         - skills
 *         - email
 *         - status
 *       properties:
 *         jobTitle:
 *           type: string
 *           description: Job title
 *           example: "Junior Developer"
 *         department:
 *           type: array
 *           items:
 *             type: string
 *           description: Job department
 *           example: ["Development"]
 *         applicantTypes:
 *           type: array
 *           items:
 *             type: string
 *           description: Eligible applicant categories
 *           example: ["graduate", "entry_level"]
 *         jobType:
 *           type: array
 *           items:
 *             type: string
 *           description: Job type
 *           example: ["full_time"]
 *         workplaceType:
 *           type: array
 *           items:
 *             type: string
 *           description: Type of workplace
 *           example: ["remote"]
 *         jobDescription:
 *           type: string
 *           description: Job description
 *           example: "Basic knowledge in JavaScript and REST APIs"
 *         jobRequirements:
 *           type: string
 *           description: Required qualifications or experience
 *           example: "Basic knowledge in JavaScript and REST APIs"
 *         jobExperience:
 *           type: array
 *           items:
 *             type: string
 *             description: Job experience
 *             example: ["fresh-grad"]
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Required skills
 *           example: ["JavaScript", "REST"]
 *         location:
 *           type: string
 *           description: Location of the job (optional)
 *           example: "cairo"
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email for applications
 *           example: "amr5179520@gmail.com"
 *         salary:
 *           type: object
 *           description: Optional salary range
 *           properties:
 *             min:
 *               type: number
 *               example: 500
 *             max:
 *               type: number
 *               example: 1000
 *         expireAt:
 *           type: string
 *           format: date-time
 *           description: Expiry date of job post
 *           example: "2025-12-01T00:00:00Z"
 *
 *     JobUpdateComponents:
 *       allOf:
 *         - $ref: '#/components/schemas/JobAddComponents'
 *         - description: All fields optional for update
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobAppAddComponents:
 *       type: object
 *       required:
 *         - email
 *         - phone
 *         - jobTitle
 *         - applicantTypes
 *         - jobType
 *         - workplaceType
 *         - currentAddress
 *       properties:
 *         companyId:
 *           type: string
 *           description: ID of the company
 *           example: "68103940fece460c7b450de0"
 *         jobId:
 *           type: string
 *           description: ID of the job
 *           example: "6813437c1f442af86931c5b6"
 *         currentAddress:
 *           type: string
 *           example: "Cairo"
 *         email:
 *           type: string
 *           format: email
 *           example: "ahmed@example.com"
 *         phone:
 *           type: string
 *           example: "+201234567890"
 *         jobTitle:
 *           type: string
 *           example: "Frontend Developer"
 *         applicantTypes:
 *           type: string
 *           enum:
 *             - student
 *             - graduate
 *             - joiner
 *             - entry_level
 *             - mid_level
 *             - senior
 *             - manager
 *             - executive
 *             - freelancer
 *             - intern
 *             - career_shifter
 *           example: "joiner"
 *         jobType:
 *           type: string
 *           enum:
 *             - full_time
 *             - part_time
 *             - internship
 *             - freelance
 *             - seasonal
 *             - apprenticeship
 *             - contract
 *           example: "full_time"
 *         workplaceType:
 *           type: string
 *           enum:
 *             - remote
 *             - on_site
 *             - hybrid
 *           example: "remote"
 *         cv:
 *           type: string
 *           format: binary
 *           description: Applicant's CV
 *         idImage:
 *           type: string
 *           format: binary
 *           description: Applicant's ID image
 *
 *     JobAppGetComponents:
 *       allOf:
 *         - $ref: '#/components/schemas/JobAppAddComponents'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "661a31a0f6f5e8b24b4a4cbb"
 *             userId:
 *               type: string
 *               example: "661a2f1e6cdd14e57d4d7d10"
 *             companyId:
 *               type: string
 *               example: "660aa927ff43b3a70e78fcbd"
 *             jobId:
 *               type: string
 *               example: "6615f82b7f9e1c6f792ac93b"
 *             profileLink:
 *               type: string
 *               example: "https://linkedin.com/in/ahmed-ali"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-04-30T10:00:00Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: "2025-04-30T12:30:00Z"
 *
 *     JobAppUpdateComponents:
 *       allOf:
 *         - $ref: '#/components/schemas/JobAppAddComponents'
 *       description: All fields optional for update
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InterviewAddComponents:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "NsueTx4kESgzfpKj1SLmTmxcBVu2"
 *         jobApplicationId:
 *           type: string
 *           example: "681390f661c63304e7301058"
 *         hrNotes:
 *           type: string
 *           example: "Candidate showed strong communication skills"
 *         location:
 *           type: string
 *           required: false
 *           example: "cairo"
 *         interviewStatus:
 *           type: string
 *           enum:
 *             - pending
 *             - rejected
 *             - shortlisted
 *             - passed
 *           example: "pending"
 *         interviewResult:
 *           type: string
 *           enum:
 *             - failed
 *             - on_hold
 *             - hired
 *           example: "on_hold"
 *         interviewDate:
 *           type: string
 *           format: date-time
 *           example: "2025-12-01T00:00:00Z"
 *         interviewPlatform:
 *           type: string
 *           enum:
 *             - zoom
 *             - google_meet
 *             - microsoftTeams
 *             - on_site
 *           example: "zoom"
 *
 *     InterviewGetComponents:
 *       allOf:
 *         - $ref: '#/components/schemas/InterviewAddComponents'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "66206bd844fc8cdff75ad7a3"
 *             companyId:
 *               type: string
 *               example: "660aa927ff43b3a70e78fcbd"
 *             userId:
 *               type: string
 *               example: "660aa927ff43b3a70e78fcbd"
 *             jobId:
 *               type: string
 *               example: "6615f82b7f9e1c6f792ac93b"
 *             address:
 *               type: string
 *               example: "cairo"
 *             interviewStatus:
 *               type: string
 *               enum:
 *                - pending
 *                - rejected
 *                - shortlisted
 *                - passed
 *             interviewResult:
 *               type: string
 *               enum:
 *                 - failed
 *                 - on_hold
 *                 - hired
 *               example: "on_hold"
 *             createdBy:
 *               type: string
 *               example: "660aa927ff43b3a70e78fcbd"
 *             updatedBy:
 *               type: string
 *               example: "660aa927ff43b3a70e78fcbd"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-04-30T10:00:00Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: "2025-04-30T12:30:00Z"
 *
 *     InterviewUpdateComponents:
 *       allOf:
 *         - $ref: '#/components/schemas/InterviewAddComponents'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AnalyticsGetComponents:
 *       type: object
 *       properties:
 *         totalCreated:
 *           type: integer
 *           default: 0
 *         totalViews:
 *           type: integer
 *           default: 0
 *         totalDeleted:
 *           type: integer
 *           default: 0
 *         totalInterested:
 *           type: integer
 *           default: 0
 *         totalStudent:
 *           type: integer
 *           default: 0
 *         totalGraduate:
 *           type: integer
 *           default: 0
 *         totalJoiner:
 *           type: integer
 *           default: 0
 *         totalEnterLevel:
 *           type: integer
 *           default: 0
 *         totalMidLevel:
 *           type: integer
 *           default: 0
 *         totalSenior:
 *           type: integer
 *           default: 0
 *         totalManager:
 *           type: integer
 *           default: 0
 *         totalFreelancer:
 *           type: integer
 *           default: 0
 *         totalIntern:
 *           type: integer
 *           default: 0
 *         totalRemote:
 *           type: integer
 *           default: 0
 *         totalOnsite:
 *           type: integer
 *           default: 0
 *         totalHybrid:
 *           type: integer
 *           default: 0
 *         totalPending:
 *           type: integer
 *           default: 0
 *         totalRejected:
 *           type: integer
 *           default: 0
 *         totalShortlisted:
 *           type: integer
 *           default: 0
 *         totalPassed:
 *           type: integer
 *           default: 0
 *         totalFailed:
 *           type: integer
 *           default: 0
 *         totalOn-hold:
 *           type: integer
 *           default: 0
 *         totalHired:
 *           type: integer
 *           default: 0
 */
