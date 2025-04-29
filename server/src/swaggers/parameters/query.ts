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
 *       name: documentType
 *       in: query
 *       required: false
 *       description: The document type
 *       schema:
 *         type: string
 *         enum: ["word", "pdf","powerpoint","excel","spreadsheet","presentation","document"]
 */