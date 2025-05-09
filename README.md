# Joblences 

Joblences is a powerful job platform that connects job seekers and companies. It allows users to search and apply for jobs, while companies can manage job postings, track applicants, and filter candidates based on certain criteria. The platform also includes social features and personalized user experiences.

## Features

##For Users
1. Account Creation & Verification
Users can sign up using their email or phone number, with verification handled through Firebase.
Until verification is completed, user data is temporarily stored using Redis for security and efficiency.

2. Profile Management
Each user has a customizable profile where they can:

Add their work experiences, skills, and personal details

Control profile visibility (Public, Friends Only, or Private)

3. Job Search & Filtering
Users can search and filter job listings in real time using GraphQL, based on:

📍 Location

💰 Salary

🕒 Duration (Full-time / Part-time)

🏢 Job Type / Industry

4. Job Applications & Tracking
Users can apply for jobs directly and track the status of each application, including:

Whether they’ve been shortlisted

Interview schedules

Application outcomes

When shortlisted, they receive automated email invitations for interviews.

5. Social Interaction
Users can engage with the community by:

Posting articles, videos, or work updates

Liking and commenting on content

Viewing and interacting with others' posts

6. Notifications
Real-time notifications are powered by Firebase, alerting users to:

Application status updates

Interview invitations

Likes, comments, and replies on social content

7. FAQs & Q&A
Users can:

Browse frequently asked questions

Participate in Q&A discussions with companies or other users

8. Application Analytics
Users can view insights such as:

Number of views on their applications

Actions taken by companies (e.g., viewed, shortlisted, rejected)



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
