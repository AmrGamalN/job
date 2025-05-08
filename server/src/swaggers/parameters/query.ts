// company query
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
 *     OwnerType:
 *       name: type
 *       in: query
 *       description: The type of the user
 *       schema:
 *         type: string
 *         enum: ["user", "company", "school"]
 *     Role:
 *       name: role
 *       in: query
 *       required: false
 *       description: The member role
 *       schema:
 *         type: string
 *         enum: ["owner", "founder", "admin", "member"]
 *     Name:
 *       name: name
 *       in: query
 *       required: false
 *       description: The member name
 *       schema:
 *         type: string
 *     Status:
 *       name: status
 *       in: query
 *       required: false
 *       description: The member status
 *       schema:
 *         type: string
 *         enum: ["active", "inactive", "pending", "rejected","banned"]
 *     Position:
 *       name: position
 *       in: query
 *       required: false
 *       description: The member Position
 *       schema:
 *         type: string
 *     Department:
 *       name: department
 *       in: query
 *       required: false
 *       description: The member department
 *       schema:
 *         type: string
 *     QuestionType:
 *       name: questionType
 *       in: query
 *       required: false
 *       description: The question type
 *       schema:
 *         type: string
 *     CompanyName:
 *       name: companyName
 *       in: query
 *       required: false
 *       description: The Company name
 *       schema:
 *         type: string
 *     Tags:
 *       name: tags
 *       in: query
 *       required: false
 *       description: The company tags
 *       schema:
 *         type: array
 *         items:
 *           type: string
 *     UserType:
 *       name: userType
 *       in: query
 *       required: false
 *       description: The user type
 *       schema:
 *         type: string
 *         enum: ["user", "member","other",]
 *     Start:
 *       name: start
 *       in: query
 *       required: false
 *       description: The start date
 *       schema:
 *         type: string
 *         format: date-time
 *     End:
 *       name: end
 *       in: query
 *       required: false
 *       description: The end date
 *       schema:
 *         type: string
 *         format: date-time
 *     Title:
 *       name: title
 *       in: query
 *       required: false
 *       description: The certificate title
 *       schema:
 *         type: string
 *     DocumentType:
 *       name: type
 *       in: query
 *       required: false
 *       description: The document type
 *       schema:
 *         type: string
 *         enum: ["word", "pdf","powerpoint","excel","spreadsheet","presentation","document"]
 *     TargetType:
 *       name: targetType
 *       in: query
 *       required: false
 *       description: The target type
 *       schema:
 *         type: string
 *         enum: ["user", "company", "school", "group", "post", "job"]
 */

// Job Query
/**
 * @swagger
 * components:
 *   parameters:
 *     SalaryMin:
 *       name: salaryMin
 *       in: query
 *       description: The minimum salary
 *       schema:
 *         type: integer
 *     SalaryMax:
 *       name: salaryMax
 *       in: query
 *       description: The maximum salary
 *       schema:
 *         type: integer
 *     Department:
 *       name: department
 *       in: query
 *       description: Department name
 *       schema:
 *         type: string
 *     Location:
 *       name: location
 *       in: query
 *       description: Job location
 *       schema:
 *         type: string
 *     Skills:
 *       name: skills
 *       in: query
 *       description: Skills required
 *       schema:
 *         type: string
 *     JobExperience:
 *       name: jobExperience
 *       in: query
 *       description: Job experience level
 *       schema:
 *         type: string
 *     ApplicantTypes:
 *       name: applicantTypes
 *       in: query
 *       description: Type of applicant
 *       schema:
 *         type: string
 *     JobType:
 *       name: jobType
 *       in: query
 *       description: Type of job
 *       schema:
 *         type: string
 *     WorkplaceType:
 *       name: workplaceType
 *       in: query
 *       description: Type of workplace (remote, onsite, hybrid)
 *       schema:
 *         type: string
 *     JobTitle:
 *       name: jobTitle
 *       in: query
 *       description: Title of the job
 *       schema:
 *         type: string
 *     SortSalary:
 *       name: salary
 *       in: query
 *       description: Sort by salary (1 for asc, -1 for desc)
 *       schema:
 *         type: integer
 *         enum: [1, -1]
 *     SortViews:
 *       name: views
 *       in: query
 *       description: Sort by views (1 for asc, -1 for desc)
 *       schema:
 *         type: integer
 *         enum: [1, -1]
 *     SortCreatedAt:
 *       name: createdAt
 *       in: query
 *       description: Sort by creation date (1 for asc, -1 for desc)
 *       schema:
 *         type: integer
 *         enum: [1, -1]
 *     ResetByName:
 *       name: resetByName
 *       in: query
 *       description: Sort by creation date (1 for asc, -1 for desc)
 *       schema:
 *         type: array
 *         items:
 *          type: string
 *     CurrAddress:
 *       name: currentAddress
 *       in: query
 *       description: The current address
 */

// Interview query
/**
 * @swagger
 * components:
 *   parameters:
 *     InterviewStatus:
 *       name: interviewStatus
 *       in: query
 *       description: The interview status
 *       schema:
 *         type: string
 *         enum: ["pending", "rejected","shortlisted", "passed"]
 *     InterviewPlatform:
 *       name: interviewPlatform
 *       in: query
 *       description: The interview platform
 *       schema:
 *         type: string
 *         enum: ["zoom", "google_meet", "on_site", "microsoftTeams"]
 *     InterviewResult:
 *       name: interviewResult
 *       in: query
 *       description: The interview result
 *       schema:
 *         type: string
 *         enum: ["passed", "failed", "on_hold", "hired"]
 */

// Connection query
/**
 * @swagger
 * components:
 *   parameters:
 *     ConnectionStatus:
 *       name: status
 *       in: query
 *       description: The connection status
 *       schema:
 *         type: string
 *         enum: ["accepted","pending"]
 *     BlockStatus:
 *       name: blockStatus
 *       in: query
 *       description: The blocked status
 *       schema:
 *         type: string
 *         enum: ["blocked", "unBlocked"]
 *     RecipientName:
 *       name: recipientName
 *       in: query
 *       description: The recipient name
 *       schema:
 *         type: string
 */

// Post query
/**
 * @swagger
 * components:
 *   parameters:
 *     Hashtag:
 *      - name: hashtag
 *        in: query
 *        description: hashtag
 *        required: false
 *        schema:
 *          type: string
 */

// Follow query
/**
 * @swagger
 * components:
 *   parameters:
 *     NameFollowing:
 *        name: nameFollowing
 *        in: query
 *        description: The following name
 *        required: false
 *        schema:
 *          type: string
 *     NameFollower:
 *        name: nameFollower
 *        in: query
 *        description: The follower Name
 *        required: false
 *        schema:
 *          type: string
 *     FollowingType:
 *        name: followingType
 *        in: query
 *        description: The following type
 *        required: false
 *        schema:
 *          type: string
 *          enum: ["user", "company", "school"]
 */

// Report query
/**
 * @swagger
 * components:
 *   parameters:
 *     ReportTargetType:
 *        name: targetType
 *        in: query
 *        description: The target type of report
 *        schema:
 *          type: string
 *          enum: ["user", "company", "school", "group", "post", "job","school","other"]
 *     ReportStatus:
 *        name: status
 *        in: query
 *        description: The report status
 *        required: false
 *        schema:
 *          type: string
 *          enum: ["pending", "reviewed", "dismissed"]
 *     Subject:
 *        name: subject
 *        in: query
 *        description: The report subject
 *        required: false
 *        schema:
 *          type: string
 */

// Help query
/**
 * @swagger
 * components:
 *   parameters:
 *     HelpStatus:
 *        name: status
 *        in: query
 *        description: The help status
 *        required: false
 *        schema:
 *          type: string
 *          enum: ["pending", "reviewed", "dismissed"]
 */
