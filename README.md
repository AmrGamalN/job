# Joblences 

Joblences is a powerful job platform that connects job seekers and companies. It allows users to search and apply for jobs, while companies can manage job postings, track applicants, and filter candidates based on certain criteria. The platform also includes social features and personalized user experiences.

## Features For Users

- Account Creation & Verification
Users can sign up using their email or phone number, with verification handled through Firebase.
Until verification is completed, user data is temporarily stored using Redis for security and efficiency.

- Profile Management
Each user has a customizable profile where they can:
Add their work experiences, skills, and personal details
Control profile visibility (Public, Friends Only, or Private)

![joblaneces-platform onrender com_api-docs_client_](https://github.com/user-attachments/assets/365f0822-b2c0-4570-8bea-0ad810d59914)


- Job Search & Filtering
Users can search and filter job listings in real time using GraphQL, based on: Locationو Salaryو Duration (Full-time / Part-time), Job Type / Industry

- Job Applications & Tracking
Users can apply for jobs directly and track the status of each application, including:
Whether they’ve been shortlisted
Interview schedules
Application outcomes
When shortlisted, they receive automated email invitations for interviews.

- Social Interaction
Users can engage with the community by:
Posting articles, videos, or work updates
Liking and commenting on content
Viewing and interacting with others' posts

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


## Technologies Used
Backend: Node.js, Express.js (for building scalable backend services)
Database: MongoDB (for storing user data, job postings, and application details)
Caching: Redis (for temporary storage of user data during verification)
Authentication: JWT (for secure and efficient user authentication)
Real-Time: Firebase (for real-time notifications and updates)
API: GraphQL (for precise data queries and RESTful API (for specific endpoints)) and Swagger 

## Setup and Installation

### 1. Clone the repository
```bash
https://github.com/AmrGamalN/job.git
```

### 2. Install dependencies
In your project directory, run:

```bash
npm install
```
### 4. Run the project
To run the project locally, execute:

```bash
npm start
```

### 5. Access the Swagger API Documentation
After starting the server, you can access the Swagger UI by visiting the following URL:

```bash
http://localhost:8080/api-docs/
```

## 🤝 Contribution Guidelines

We welcome contributions! Here’s the step-by-step process to contribute:

### **1. Create a New Branch**

- **Feature branches**: `feature/hd-{ticket-number}` (e.g., `feature/hd-66`)
- **Bugfix branches**: `bugfix/hd-{ticket-number}` (e.g., `bugfix/hd-77`)

### **2. Make Your Changes**

After making changes, stage them with:

```bash
git add .
```

### **3Commit Your Changes**

Follow the commit message format:

- **Example:**

```bash
git commit -m "hd-121: Disabled checkout button when no address is added"
```

### **4 Push Your Branch**

Push the branch to the remote repository:

```bash
   git push origin {your-branch-name}
```
