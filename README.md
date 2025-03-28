

EduSync Portal 🚀

A comprehensive exam management system for students, faculty, and coordinators.



📌 Features
	•	Role-based Access: Separate dashboards for students, faculty, and coordinators.
	•	Exam Scheduling & Management: Auto-generated timetables and duty allocations.
	•	Secure Login: (For now, authentication is disabled for easy testing).
	•	Result Publication: Automated processing and grievance handling.

🛠 Tech Stack
	•	Frontend: React + TypeScript + TailwindCSS
	•	Backend: Supabase
	•	Database: Supabase 
	•	State Management: Context API 

🚀 Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/EduSync.git
cd EduSync

2️⃣ Install Dependencies

npm install

3️⃣ Run the Development Server

npm run dev -- --open

By default, the app runs on http://localhost:3003/ (or another available port).

4️⃣ Fix a Custom Port (Optional)

Modify .env file:

PORT=3001

Run:

npm run dev

🔑 Login Flow
	•	Login Page allows users to select:
	•	Student → Redirects to student portal
	•	Faculty → Redirects to faculty portal
	•	Exam Coordinator → Redirects to admin portal
	•	No authentication applied yet (for now, login works regardless of input).

📜 License

This project is MIT Licensed. See the LICENSE file for more details.

