# Task Management System

This is a role-based task management application built with **Next.js 16** and **MongoDB**.  
It allows **admins** to create, assign, and manage tasks, while **users** can view and track their assigned tasks.  
The project also includes mock data seed routes for quick demonstration on a fresh setup.

---

## Features

- JWT-based authentication using JOSE  
- Role-based access control (Admin and User)  
- Task creation, assignment, and update  
- Dashboard with task statistics  
- Mock data seeding for demo setup  

---

## Pages Overview

| Route | Description |
|--------|-------------|
| `/` | Dashboard (Admin/User) |
| `/login` | User login |
| `/sign-up` | User registration |
| `/tasks/new` | Create a new task (Admin only) |
| `/tasks/[id]` | Task details page |
| `/tasks/[id]/edit` | Edit task (Admin only) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/login` | Login user |
| POST | `/api/sign-up` | Register new user |
| POST | `/api/logout` | Logout user |
| POST | `/api/tasks` | Create new task (Admin) |
| GET | `/api/tasks/create` | Get all tasks created by admin |
| GET | `/api/tasks/assigned` | Get all tasks assigned to a user |
| GET | `/api/tasks/[id]` | Get task details |
| PUT | `/api/tasks/[id]` | Update task (Admin) |
| DELETE | `/api/tasks/[id]` | Delete task (Admin) |
| GET | `/api/tasks/stats` | Get task statistics for dashboard |

Additional demo routes for mock data:
- `/api/demonstrate/seed-users`
- `/api/demonstrate/seed-tasks`

---

## Project Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dSumitabha/tmsystem.git

2. **Navigate to the project directory**
   cd tmsystem

3. **Install dependencies**

    npm install

4. **Create a .env file with this fields**

    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key

5. **Run the Development Server**
    npm run dev