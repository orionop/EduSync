# EduSync 🚀

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC.svg)](https://tailwindcss.com/)

> A unified exam management platform that streamlines scheduling, faculty allocation, and result processing for seamless academic workflows.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

EduSync is a comprehensive exam management system designed to streamline the entire examination process from scheduling to results publication. The platform provides dedicated interfaces for students, faculty members, and administrative coordinators through a unified application, ensuring a seamless and efficient academic workflow.

### Key Capabilities

- **Unified Portal**: Single application with role-based access for students, faculty, and admins
- **Cross-User Communication**: Admin can send notifications to all students/faculty, faculty can message students
- **Automated Exam Scheduling**: Intelligent timetable generation and conflict resolution
- **Faculty Allocation**: Smart assignment of supervisory duties based on availability
- **Result Processing**: Automated calculation and publication of exam results
- **Real-Time Notifications**: Stay updated with exam schedules, results, and announcements
- **AI Assistant**: Built-in Ed chatbot for academic guidance

---

## ✨ Features

### For Students 👨‍🎓
- View academic calendar and exam schedules
- Download hall tickets
- Access exam results and transcripts
- Apply for KT (backlog) examinations
- Submit assignments and coursework
- View placement eligibility criteria
- Apply for revaluation/photocopy/rechecking

### For Faculty 👨‍🏫
- View assigned supervisory duties
- Submit and calculate student marks
- Evaluate end-semester examinations
- Access proctoring tools and camera feeds
- View student results and performance
- Send messages to students
- Manage revaluation requests

### For Administrators 👨‍💼
- Configure exam schedules and timetables
- Manage faculty duty allocations
- Oversee exam prerequisites and applications
- Monitor exam progress and submissions
- Publish results and announcements
- Send notifications to all users or specific roles
- System-wide configuration and management

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management
- **React Hot Toast** - Notifications

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - Authentication (Email/Password, OAuth: Google, GitHub, Discord)
  - PostgreSQL Database
  - Real-time subscriptions
  - Storage API
  - Row Level Security (RLS)

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

Navigate to the `app/` directory and create a `.env` file:

```bash
cd app
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
```

> **Important**: Never commit `.env` files. They are already in `.gitignore`.

### Step 3: Install Dependencies

```bash
cd app
npm install
```

### Step 4: Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations from `db/migrations/` in order:
   - `001_create_users_table.sql`
   - `002_update_users_table_add_missing_fields.sql`
   - `003_enhance_rls_policies.sql`
   - `004_update_trigger_for_oauth.sql`
   - `007_cross_user_connectivity.sql` (for cross-user communication)
3. Configure OAuth providers in Supabase Dashboard (Google, GitHub, Discord)

### Step 5: Run the Application

```bash
cd app
npm run dev
```

The application will be available at `http://localhost:3000`

### Step 6: Access the Application

1. Navigate to `http://localhost:3000/login`
2. Sign in with your credentials or use OAuth providers
3. You'll be redirected to the appropriate portal based on your role

---

## 🔐 Authentication

EduSync supports multiple authentication methods:

- **Email/Password**: Traditional email-based authentication
- **OAuth Providers**: 
  - Google
  - GitHub
  - Discord

Users are automatically assigned roles (student, faculty, admin) based on their profile in the database.

---

## 📝 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Analyze bundle size
npm run analyze
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)
- Component-based architecture

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

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
