# Joblences 

Joblences is a powerful job platform that connects job seekers and companies. It allows users to search and apply for jobs, while companies can manage job postings, track applicants, and filter candidates based on certain criteria. The platform also includes social features and personalized user experiences.

## Api Docs For Preview
- https://joblaneces-platform.onrender.com/api-docs/ [ client - auth - company - job - post - support ]
- ex  https://joblaneces-platform.onrender.com/api-docs/client

## Features For Users

- Account Creation & Verification
Users can sign up using their email or phone number, with verification handled through Firebase.
Until verification is completed, user data is temporarily stored using Redis for security and efficiency.

- Profile Management
Each user has a customizable profile where they can:
Add their work experiences, skills, and personal details
Control profile visibility (Public, Friends Only, or Private)

![joblaneces-platform onrender com_api-docs_client_](https://github.com/user-attachments/assets/eac4d1fe-8725-4479-9317-db6b8539910c)


- Job Search & Filtering
Users can search and filter job listings in real time using GraphQL, based on: Locationو Salaryو Duration (Full-time / Part-time), Job Type / Industry

- Job Applications & Tracking
Users can apply for jobs directly and track the status of each application, including:
Whether they’ve been shortlisted
Interview schedules
Application outcomes
When shortlisted, they receive automated email invitations for interviews.

![joblaneces-platform onrender com_api-docs_job_](https://github.com/user-attachments/assets/81c3dc4e-e69d-42ec-bc5e-a3c03f7b40e6)


- Social Interaction
Users can engage with the community by:
Posting articles, videos, or work updates
Liking and commenting on content
Viewing and interacting with others' posts

![joblaneces-platform onrender com_api-docs_post_](https://github.com/user-attachments/assets/d2967cd7-5e99-4747-895a-d5466efee346)



- Notifications
Real-time notifications are powered by Firebase, alerting users to:
Application status updates
Interview invitations
Likes, comments, and replies on social content

- FAQs & Q&A
Users can:
Browse frequently asked questions
Participate in Q&A discussions with companies or other users

- Application Analytics
Users can view insights such as:
Number of views on their applications
Actions taken by companies (e.g., viewed, shortlisted, rejected)

## Features For Companies
- Company Profiles
Companies have public profiles that showcase:
Business overview, Open job positions, Team members and roles (based on access control)

![joblaneces-platform onrender com_api-docs_company_](https://github.com/user-attachments/assets/d066aa38-797f-470e-bee9-79d9bb03e413)

- Role-Based Access Control (RBAC)
Each company manages its internal access using predefined roles: Owner, Founder, Admin, Member, Viewer
This ensures proper permission levels for editing, posting, or viewing sensitive data.

- Job Posting & Management
Companies can: Create detailed job postings with qualifications, experience, and salary ranges
Edit or remove listings as needed

- Application Review & Filtering
Companies can: Filter applicants by experience, qualifications, and custom parameters
Automatically send interview invitations via email to shortlisted candidates

- Content Sharing
Companies can publish: Articles, industry insights, and videos to engage with users and establish credibility

- Company Analytics
Track performance for each job post, including: Number of views, Number of applications, Engagement rate per listing

## Help & Report

![joblaneces-platform onrender com_api-docs_support_](https://github.com/user-attachments/assets/4461f2f8-aa81-43bb-b8d5-7ec7d2ecf7ca)
  

## Technologies Used
 - Backend: Node.js, Express.js (for building scalable backend services)
 - Database: MongoDB (for storing user data, job postings, and application details...)
 - Caching: Redis (for temporary storage of user data during verification)
 - Authorization: Role-based access control (Admin roles only)
 - Authentication: JWT (for secure and efficient user authentication)
 - Real-Time: Firebase (for real-time notifications and updates)
 - API: GraphQL (for precise data queries and RESTful API (for specific endpoints))
 - Documentation: Swagger (for documenting the backend APIs)

## Email messages
- Track company details

![company](https://github.com/user-attachments/assets/e31b7349-3e80-4b45-9488-2c8d24001f28)

- Send interview details

![interview](https://github.com/user-attachments/assets/ca42e1b0-4858-4e1b-b835-00d0f71286bd)

- Verification Email Link

![verify](https://github.com/user-attachments/assets/56c7c81d-c52e-4e1e-99a3-c5a041ed37c8)

