# Joblences 

Joblences is a powerful job platform that connects job seekers and companies. It allows users to search and apply for jobs, while companies can manage job postings, track applicants, and filter candidates based on certain criteria. The platform also includes social features and personalized user experiences.

## Features

1. User Profiles & Company Profiles
User Profiles: Each user has a customizable profile where they can display their work experiences, skills, and personal information. The visibility of profiles can be public, friends-only, or private, depending on the user's preferences.

Company Profiles: Companies also have profiles where they can showcase their business, open job positions, and interact with potential candidates. The profile can be accessed based on the role of the user (admin, employee, etc.).

## Tech Stack

- **Node.js**: JavaScript runtime used for building the backend service.
- **Express.js**: Web framework for building REST APIs.
- **MongoDB**: NoSQL database used to store data.
- **SQL**: Neon DB.
- **Mongoose**: ODM for interacting with MongoDB.
- **Zod**: Data validation library.

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
