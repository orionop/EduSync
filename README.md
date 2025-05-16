# EduSync Portal 🚀

## Introduction

EduSync is an AI-powered exam management platform that automates scheduling, faculty allocation, and result processing for seamless academic workflows. This comprehensive system provides dedicated interfaces for students, faculty members, and administrative coordinators, streamlining the entire examination process from scheduling to results publication.

## System Architecture

The EduSync platform follows a modern web application architecture with the following components:

```
                        ┌─────────────────┐
                        │                 │
                        │  Central Login  │
                        │     Portal      │
                        │                 │
                        └────────┬────────┘
                                 │
                                 ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Student Portal │     │ Faculty Portal  │     │  Admin Portal   │
│    (React)      │     │    (React)      │     │    (React)      │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         └───────────┬───────────┴───────────┬───────────┘
                     │                       │
             ┌───────┴───────┐       ┌───────┴───────┐
             │               │       │               │
             │  Supabase     │       │   Database    │
             │  Backend      │◄─────►│   (Postgres)  │
             │               │       │               │
             └───────────────┘       └───────────────┘
```

### Tech Stack
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **State Management**: Context API
- **Authentication**: JWT-based auth via Supabase

## Features

- **Role-based Access Control**: Separate dashboards for students, faculty, and coordinators
- **Exam Scheduling & Management**: Auto-generated timetables and duty allocations
- **Secure Authentication**: (For development purposes, authentication is currently disabled)
- **Result Processing**: Automated result calculation and publication
- **Grievance Handling**: Streamlined process for addressing student concerns

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/orionop/EduSync.git
cd EduSync
```

### 2. Deployment Instructions

The application consists of four separate modules that need to be deployed individually. Open four separate terminal windows and follow these steps:

**Terminal 1 - Student Portal:**
```bash
cd edusync/student\ /
npm install
npm run dev
```

**Terminal 2 - Admin Portal:**
```bash
cd edusync/admin
npm install
npm run dev
```

**Terminal 3 - Faculty Portal:**
```bash
cd edusync/faculty
npm install
npm run dev
```

**Terminal 4 - Login Portal:**
```bash
cd edusync/login
npm install
npm run dev
```

After all four modules are running, navigate to http://localhost:3003 to access the central login page, which will direct you to the appropriate portal based on your role.

### 3. Login Credentials

#### Central Login
- **Email**: user@edusync
- **Password**: 1234

#### Admin Login
- **Email**: admin@edvantage
- **Password**: 1234

## Portal Access

The system provides a central login page that directs users to three distinct portals:

- **Student Portal**: Academic calendar, exam schedules, and results
- **Faculty Portal**: Duty allocation, question paper submission, and grading
- **Admin Portal**: System configuration, scheduling, and oversight

## License

This project is licensed under the MIT License - see the LICENSE file for details.