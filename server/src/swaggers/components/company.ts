/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyGetComponents:
 *       type: object
 *       properties:
 *         companyName:
 *           type: string
 *           example: "Tech Innovators Ltd."
 *           default: ""
 *         companyType:
 *           type: string
 *           example: "Private"
 *           default: "Private"
 *         companyIndustry:
 *           type: string
 *           example: "Information Technology"
 *           default: ""
 *         companySize:
 *           type: integer
 *           example: 100
 *           default: 0
 *         description:
 *           type: string
 *           example: "A leading technology company focused on software development."
 *           default: ""
 *         companyPhone:
 *           type: string
 *           example: "+201200812638"
 *           default: ""
 *         companyEmail:
 *           type: string
 *           example: "amr5179520@gmail.com"
 *           default: ""
 *         introVideoUrl:
 *           type: string
 *           example: "https://example.com/intro-video.mp4"
 *           default: ""
 *         website:
 *           type: string
 *           example: "https://techinnovators.com"
 *           default: ""
 *         linkedIn:
 *           type: string
 *           example: "https://www.linkedin.com/company/tech-innovators"
 *           default: ""
 *         facebook:
 *           type: string
 *           example: "https://www.facebook.com/techinnovators"
 *           default: ""
 *         twitter:
 *           type: string
 *           example: "https://twitter.com/tech_innovators"
 *           default: ""
 *         github:
 *           type: string
 *           example: "https://github.com/tech-innovators"
 *           default: ""
 *         department:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Engineering", "Sales", "Marketing"]
 *           default: []
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Technology", "Software", "Innovation"]
 *           default: []
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Node.js", "React", "MongoDB"]
 *           default: []
 *         legalInfo:
 *           type: object
 *           required: true
 *           properties:
 *             registrationNumber:
 *               type: string
 *               example: "REG-123456"
 *               default: ""
 *             taxId:
 *               type: string
 *               example: "TAX-987654321"
 *               default: ""
 *             legalName:
 *               type: string
 *               example: "Tech Innovators Ltd."
 *               default: ""
 *             countryOfIncorporation:
 *               type: string
 *               example: "United Kingdom"
 *               default: ""
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyAddComponents:
 *       allOf:
 *         - $ref: '#/components/schemas/CompanyGetComponents'
 *         - type: object
 *           required:
 *             - companyName
 *             - companyType
 *             - companyIndustry
 *             - description
 *             - companyEmail
 *           properties:
 *             companyLogo:
 *               type: string
 *               format: binary
 *               description: The company logo image file
 *             profileImage:
 *               type: string
 *               format: binary
 *               description: The company profile image file
 *             coverImage:
 *               type: string
 *               format: binary
 *               description: The company cover image file
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyUpdateComponents:
 *       allOf:
 *         - $ref: '#/components/schemas/CompanyGetComponents'
 *         - type: object
 *           properties:
 *             companyLogo:
 *               type: string
 *               format: binary
 *               description: The company logo image file
 *             profileImage:
 *               type: string
 *               format: binary
 *               description: The company profile image file
 *             coverImage:
 *               type: string
 *               format: binary
 *               description: The company cover image file
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MemberGetComponents:
 *       type: object
 *       properties:
 *         companyId:
 *           type: string
 *           example: "605c72ef153207001f29f6b"
 *         userId:
 *           type: string
 *           example: "60e72be9b1a2b00015b0e4a9"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         role:
 *           type: string
 *           enum: ["owner", "founder", "admin", "member"]
 *           default: "member"
 *           example: "admin"
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "pending", "rejected", "banned"]
 *           default: "pending"
 *           example: "active"
 *         position:
 *           type: string
 *           example: "Software Engineer"
 *         department:
 *           type: string
 *           example: "Engineering"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         addedBy:
 *           type: string
 *           example: "adminUser123"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-23T18:25:43.511Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-23T18:25:43.511Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MemberAddComponents:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "NsueTx4kESgzfpKj1SLmTmxcBVu2"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         role:
 *           type: string
 *           enum: ["owner", "founder", "admin", "member"]
 *           default: "member"
 *           example: "member"
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "pending", "rejected", "banned"]
 *           default: "pending"
 *           example: "active"
 *         position:
 *           type: string
 *           example: "Software Engineer"
 *         department:
 *           type: string
 *           example: "Engineering"
 *         email:
 *           type: string
 *           example: "amr5189520@gmail.com"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CertificateGetComponents:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Certified React Developer"
 *         description:
 *           type: string
 *           example: "Certificate awarded for completing the React.js course."
 *         issuer:
 *           type: string
 *           example: "React Academy"
 *         issuedAt:
 *           type: string
 *           format: date
 *           example: "2021-08-01"
 *         certificateUrl:
 *           type: string
 *           example: "https://example.com/certificates/react-developer.pdf"
 *         uploadBy:
 *           type: string
 *           example: "adminUser123"
 *         updateBy:
 *           type: string
 *           example: "managerUser456"
 *           default: ""
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-23T18:25:43.511Z"
 *         updateAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-23T18:25:43.511Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CertificateAddComponents:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Certified React Developer"
 *         description:
 *           type: string
 *           example: "Certificate awarded for completing the React.js course."
 *         issuer:
 *           type: string
 *           example: "React Academy"
 *         issuedAt:
 *           type: string
 *           format: date
 *           example: "2021-08-01"
 *         certificateUrl:
 *           type: string
 *           example: "https://example.com/certificates/react-developer.pdf"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FaqGetComponents:
 *       type: object
 *       properties:
 *         companyId:
 *           type: string
 *           example: "605c72ef153207001f29f6b"
 *         userId:
 *           type: string
 *           example: "648a3b9ef23eab001e65f341"
 *         question:
 *           type: string
 *           example: "What are the company’s working hours?"
 *         department:
 *           type: string
 *           example: "Human Resources"
 *         questionType:
 *           type: string
 *           example: "General"
 *         userType:
 *           type: string
 *           enum: [member, user, other]
 *           default: user
 *           example: "user"
 *         status:
 *           type: string
 *           enum: [pending, answered, rejected]
 *           default: pending
 *           example: "pending"
 *         answer:
 *           type: string
 *           example: "Our working hours are from 9 AM to 5 PM."
 *         answerBy:
 *           type: string
 *           example: "adminUser456"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FaqAddComponents:
 *       type: object
 *       properties:
 *         companyId:
 *           type: string
 *           example: "605c72ef153207001f29f6b"
 *         question:
 *           type: string
 *           example: "What are the company’s working hours?"
 *         department:
 *           type: string
 *           example: "Human Resources"
 *         questionType:
 *           type: string
 *           example: "General"
 *         userType:
 *           type: string
 *           enum: [member, user, other]
 *           default: user
 *           example: "user"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FaqUpdateComponents:
 *       type: object
 *       properties:
 *         question:
 *           type: string
 *           example: "What are the company’s working hours?"
 *         department:
 *           type: string
 *           example: "Human Resources"
 *         questionType:
 *           type: string
 *           example: "General"
 *         userType:
 *           type: string
 *           enum: [member, user, other]
 *           default: user
 *           example: "user"
 *         status:
 *           type: string
 *           enum: [pending, answered, rejected]
 *           description: The faq status, add by admin
 *           default: pending
 *           example: "pending"
 *         answer:
 *           type: string
 *           example: "Our working hours are from 9 AM to 5 PM."
 *           description:  The faq answer, add by admin
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FeedBackGetComponents:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Feedback unique ID
 *         companyId:
 *           type: string
 *           description: ID of the related company
 *         companyName:
 *           type: string
 *           description: Name of the company
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - active
 *             - inactive
 *             - rejected
 *             - banned
 *           default: pending
 *           description: Current feedback status
 *         message:
 *           type: string
 *           description: Feedback message content
 *         updateBy:
 *           type: string
 *           description: ID of the user who updated the feedback
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FeedBackUpdateComponents:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - active
 *             - inactive
 *             - rejected
 *             - banned
 *           default: pending
 *           description: Current feedback status
 *         message:
 *           type: string
 *           description: Feedback message
 *           example: Your company Tech is currently pending review. Thank you for your interest in creating a company on Jobliences. Your request has been received and is currently under review. We will notify you once the review process is completed and a decision has been made. In the meantime, feel free to reach out to us if you have any questions or need further assistance. We appreciate your patience. The Jobliences Team
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DocumentGetComponents:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Document unique ID
 *         companyId:
 *           type: string
 *           description: ID of the related company
 *         name:
 *           type: string
 *           description: Name of the document
 *         description:
 *           type: string
 *           description: Description of the document
 *         documentFile:
 *           type: object
 *           properties:
 *             fileUrl:
 *               type: string
 *               description: URL to the uploaded file
 *             documentType:
 *               type: string
 *               description: Type/category of the document
 *         uploadBy:
 *           type: string
 *           description: User ID who uploaded the document
 *         updatedBy:
 *           type: string
 *           description: User ID who last updated the document
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Document creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Document update timestamp
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DocumentAddComponents:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the document
 *         description:
 *           type: string
 *           description: Description of the document
 *         documentFile:
 *           type: string
 *           format: binary
 *           description: The document file
 */
