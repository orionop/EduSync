# EduSync Portal 🚀

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC.svg)](https://tailwindcss.com/)

> An AI-powered exam management platform that automates scheduling, faculty allocation, and result processing for seamless academic workflows.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 🎯 Overview

EduSync is a comprehensive exam management system designed to streamline the entire examination process from scheduling to results publication. The platform provides dedicated interfaces for students, faculty members, and administrative coordinators, ensuring a seamless and efficient academic workflow.

### Key Capabilities

- **Automated Exam Scheduling**: Intelligent timetable generation and conflict resolution
- **Faculty Allocation**: Smart assignment of supervisory duties based on availability
- **Result Processing**: Automated calculation and publication of exam results
- **Role-Based Access Control**: Secure, segregated dashboards for different user types
- **Real-Time Notifications**: Stay updated with exam schedules, results, and announcements
- **Grievance Management**: Streamlined process for addressing student concerns

---

## ✨ Features

### For Students 👨‍🎓
- View academic calendar and exam schedules
- Apply for examinations online
- Download hall tickets
- Access exam results and transcripts
- Submit grievances and track their status
- View placement eligibility criteria

### For Faculty 👨‍🏫
- View assigned supervisory duties
- Submit question papers securely
- Evaluate and grade student submissions
- Access proctoring tools and camera feeds
- Calculate and submit marks
- View student results

### For Administrators 👨‍💼
- Configure exam schedules and timetables
- Manage faculty duty allocations
- Oversee exam prerequisites and applications
- Monitor exam progress and submissions
- Publish results and announcements
- System-wide configuration and management

---

## 🏗️ Architecture

The EduSync platform follows a modern microservices architecture with separate portals for each user type:

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

### System Components

- **Central Login Portal**: Unified authentication gateway (Port 3003)
- **Student Portal**: Student-facing interface (Port 3000)
- **Faculty Portal**: Faculty dashboard and tools (Port 3001)
- **Admin Portal**: Administrative control panel (Port 3002)
- **Supabase Backend**: Authentication, API, and real-time features
- **PostgreSQL Database**: Relational data storage

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **Context API** - State management

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - Authentication (JWT-based)
  - PostgreSQL Database
  - Real-time subscriptions
  - Storage API
- **PostgreSQL** - Relational database

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account** (for backend services)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/orionop/EduSync.git
cd EduSync
```

### Step 2: Environment Setup

Create `.env` files in each portal directory with your Supabase credentials:

**Example `.env` file:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Install Dependencies

Install dependencies for each portal:

```bash
# Student Portal
cd student
npm install

# Admin Portal
cd ../admin
npm install

# Faculty Portal
cd ../faculty
npm install

# Login Portal
cd ../login
npm install
```

### Step 4: Database Setup

1. Set up your Supabase project
2. Run the database seed scripts from the `db/` directory
3. See `db/README.md` for detailed seeding instructions

### Step 5: Run the Application

Open **four separate terminal windows** and run each portal:

**Terminal 1 - Student Portal:**
```bash
cd student
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Faculty Portal:**
```bash
cd faculty
npm run dev
# Runs on http://localhost:3001
```

**Terminal 3 - Admin Portal:**
```bash
cd admin
npm run dev
# Runs on http://localhost:3002
```

**Terminal 4 - Login Portal:**
```bash
cd login
npm run dev
# Runs on http://localhost:3003
```

> **Note**: Navigate to http://localhost:3003 to access the central login page, which will redirect you to the appropriate portal based on your role.

### Step 6: Access the Application

1. Navigate to the login portal URL: `http://localhost:3003`
2. Use the credentials below to log in

---

## 🔐 Login Credentials

### Central Login Portal
- **Email**: `user@edusync`
- **Password**: `1234`

### Admin Portal (Direct Access)
- **Email**: `admin@edvantage`
- **Password**: `1234`

> ⚠️ **Security Note**: These are default development credentials. Change them in production!

---

## 📁 Project Structure

```
EduSync/
├── admin/                 # Admin portal application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context providers
│   │   └── store/        # State management
│   └── package.json
│
├── faculty/              # Faculty portal application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
│
├── student/             # Student portal application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── package.json
│
├── login/                # Central login portal
│   ├── src/
│   │   └── pages/
│   └── package.json
│
├── db/                   # Database scripts
│   ├── seeds/           # Seed data files
│   └── README.md        # Database setup guide
│
├── lib/                  # Shared libraries
│   └── supabase.ts      # Supabase client configuration
│
├── docs/               # Documentation
│   └── *.pdf          # Documentation PDFs
│
├── assets/            # Static assets
│   ├── images/       # Screenshots
│   └── flows/        # Flow diagrams
│
├── types/             # TypeScript type definitions
│   └── supabase.ts
│
├── supabase/           # Supabase configuration
│   └── config.toml
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📸 Screenshots

Screenshots and demo images are available in the `assets/images/` directory:

- Dashboard views for each portal
- Exam scheduling interface
- Result viewing screens
- Faculty duty allocation

> See `assets/images/` for full screenshots and `assets/flows/` for user flow diagrams.

---

## 🔮 Future Improvements

- [ ] **Enhanced AI Features**: Advanced scheduling algorithms with ML-based optimization
- [ ] **Mobile Applications**: Native iOS and Android apps for better mobile experience
- [ ] **Offline Support**: Progressive Web App (PWA) capabilities
- [ ] **Advanced Analytics**: Comprehensive reporting and analytics dashboard
- [ ] **Integration APIs**: RESTful APIs for third-party integrations
- [ ] **Multi-language Support**: Internationalization (i18n) for multiple languages
- [ ] **Enhanced Security**: Two-factor authentication (2FA) and advanced security features
- [ ] **Automated Notifications**: Email and SMS notifications for important events
- [ ] **Video Proctoring**: AI-powered video monitoring during exams
- [ ] **Blockchain Integration**: Secure, tamper-proof result storage

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Anurag Paresh Shetye**

- GitHub: [@orionop](https://github.com/orionop)
- Email: anuragshetye@gmail.com

---

## 🙏 Acknowledgments

- Supabase team for the excellent backend platform
- React and TypeScript communities
- All contributors and testers

---

<div align="center">

**Made with ❤️ for educational institutions**

⭐ Star this repo if you find it helpful!

</div>
