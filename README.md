# Joblences 

Joblences is a powerful job platform that connects job seekers and companies. It allows users to search and apply for jobs, while companies can manage job postings, track applicants, and filter candidates based on certain criteria. The platform also includes social features and personalized user experiences.

## Features

1. User Profiles & Company Profiles
User Profiles: Each user has a customizable profile where they can display their work experiences, skills, and personal information. The visibility of profiles can be public, friends-only, or private, depending on the user's preferences.

Company Profiles: Companies also have profiles where they can showcase their business, open job positions, and interact with potential candidates. The profile can be accessed based on the role of the user (admin, employee, etc.).

2. Job Search and Filtering
Users can search for jobs based on various filters such as:

Location

Salary

Duration (Full-time / Part-time)

Industry/Type of Job

Real-time data: The search results are updated in real-time, thanks to the integration of GraphQL for precise querying.

3. Role-Based Access Control
The platform is built with a Role-Based Access Control (RBAC) system, which ensures that users can access different features depending on their role within the company.

Roles include: Owner, Founder, Admin, Member, and Viewer.

4. Job Application & Company Interaction
Job Postings: Companies can post job openings with detailed descriptions and requirements.

Job Applications: Users can apply for jobs, and companies can filter applications based on various parameters (e.g., qualifications, experience).

Interview Invitations: Once a company filters candidates, an automated email is sent to the applicants with details about the interview schedule.

5. Social Features
Users can interact with each other via posts, comments, and likes on content like articles, videos, and updates.

Posts: Users can share content (e.g., work experiences, articles, videos).

Likes: Posts can be liked by other users, allowing for greater interaction within the platform.

Articles: Companies or users can publish articles or videos related to their industry.

6. Real-Time Notifications & Firebase Integration
Firebase is integrated to provide real-time notifications to users.

Notifications include job application updates, interview invitations, social media interactions, and more.

7. Email and Phone Verification
Redis is used for temporary storage of user data until email or phone verification is completed. This ensures that users have a verified email or phone number before they can fully use the platform.

8. FAQs & User Interaction
Users can search for frequently asked questions (FAQs) related to companies, job applications, and the platform in general.

A Q&A section is available where users can ask questions and get responses from companies or other users.

9. GraphQL API and RESTful Integration
The platform uses GraphQL for fine-grained control over the data returned to users, making the API efficient and flexible.

It also integrates RESTful API endpoints for certain functionalities like job postings, applications, and profile management.

10. Company & User Analytics
Companies can track metrics related to their job postings, such as how many views and applications a particular job has received.

Users can view analytics related to their job applications, such as the status of their application and any actions taken by the company.

##Technologies Used
Frontend: React.js (for the user interface and interaction)

Backend: Node.js, Express.js (for building scalable backend services)

Database: MongoDB (for storing user data, job postings, and application details)

Caching: Redis (for temporary storage of user data during verification)

Authentication: JWT (for secure and efficient user authentication)

Real-Time: Firebase (for real-time notifications and updates)

API: GraphQL (for precise data queries and RESTful API (for specific endpoints))

Deployment: AWS (for hosting the platform in a scalable environment)

## Setup and Installation

### 1. Clone the repository
```bash
git clone https://github.com/HallaDeals/HallaDeals-BE.git
```

### 2. Install dependencies
In your project directory, run:

```bash
npm install
```

### 3. Setup environment variables
Create a .env file in the root of the project directory and add the following variables:

```bash
MONGODB_URI=mongodb+srv://halladeals26:#password@cluster0.lsrg6.mongodb.net/halla?retryWrites=true&w=majority&appName=Cluster0
PORT=8080
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
