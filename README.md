

EduSync Portal 🚀

A comprehensive exam management system for students, faculty, and coordinators.



📌 Features
	•	Role-based Access: Separate dashboards for students, faculty, and coordinators.
	•	Exam Scheduling & Management: Auto-generated timetables and duty allocations.
	•	Secure Login: (For now, authentication is disabled for easy testing).
	•	Result Publication: Automated processing and grievance handling.

🛠 Tech Stack
	•	Frontend: React + Astro + TailwindCSS
	•	Backend: Node.js + Express (Planned)
	•	Database: MongoDB / PostgreSQL (Planned)
	•	State Management: Context API / Redux

🚀 Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/edusync-portal.git
cd edusync-portal

2️⃣ Install Dependencies

npm install

3️⃣ Run the Development Server

npm run dev

By default, the app runs on http://localhost:5173/ (or another available port).

4️⃣ Fix a Custom Port (Optional)

Modify .env file:

PORT=3001

Run:

npm run dev

🔑 Login Flow
	•	Login Page allows users to select:
	•	Student → Redirects to student/src/pages/Dashboard.tsx
	•	Faculty → Redirects to faculty/src/pages/Dashboard.tsx
	•	Exam Coordinator → Redirects to admin/src/pages/AdminDashboard.tsx
	•	No authentication applied yet (for now, login works regardless of input).

📁 Project Structure

/edusync-portal
│── /src
│   ├── /pages
│   │   ├── /admin
│   │   ├── /student
│   │   ├── /faculty
│   ├── /components
│   ├── /utils
│── astro.config.mjs
│── package.json
│── README.md

🤝 Contributing
	1.	Fork the repository.
	2.	Create a new branch (feature/new-feature).
	3.	Commit your changes (git commit -m "Added new feature").
	4.	Push to your branch (git push origin feature/new-feature).
	5.	Create a Pull Request.

📜 License

This project is MIT Licensed. See the LICENSE file for more details.

