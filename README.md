# 🧠 AI-Powered Online Judge

A modern, full-featured online judge built with the MERN stack, designed for solving coding problems, managing submissions, and receiving AI-powered code reviews. This project includes real-time code execution in multiple languages, problem management for admins, and user dashboards with analytics and streak tracking.

---

## 📌 Features

- ✅ Solve coding problems in C++, Python, and Java
- 🧪 Automatic code evaluation with hidden test cases
- 🧠 AI Review system (powered by Gemini API)
- 🧑‍🏫 Admin dashboard to add/edit/delete problems
- 🗃 User submission history with verdicts and timestamps
- 📊 Analytics dashboard with streaks and heatmap
- 🔐 JWT authentication with HTTP-only cookies
- 🐳 Dockerized compiler microservice
- 📁 File-based test case management
- 🚫 Handles edge cases like extra newlines, whitespaces, and TLE

---

## 🧰 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Flowbite React (Tabs, Cards, Components)

**Backend:**
- Node.js & Express
- MongoDB Atlas
- Multer (for uploading test cases)
- JWT & bcrypt

**Compiler Service:**
- Node.js (child_process)
- Docker (isolated code execution)

**AI Integration:**
- Gemini API (Google)

---

## 🏗️ System Architecture

```txt
[Frontend - React]
      |
      v
[Main Backend - Node.js + Express]
      |
      ├── MongoDB Atlas (users, problems, submissions)
      └── Compiler Server (code execution)
              |
              └── Runs inside Docker
📁 Folder Structure

/frontend               → React app
/backend
  ├── models            → Mongoose models
  ├── routes            → Auth, problems, submissions
  ├── controllers       → Logic for each route
  ├── middleware        → Auth, role-based access
  ├── uploads           → Test cases (input/output)
/compiler-server
  ├── codefiles         → Temp code files
  ├── executables       → Compiled binaries
  
🚀 Getting Started
1. Clone the Repo

git clone https://github.com/your-username/online-judge-ai.git
cd online-judge-ai
2. Backend Setup

cd backend
npm install
cp .env.example .env
# Fill in Mongo URI, JWT_SECRET, Gemini API Key etc.
npm run dev
3. Compiler Server Setup

cd compiler-server
npm install
# For local use
node index.js

# OR run in Docker
docker build -t oj-compiler .
docker run -p 5001:5001 oj-compiler
4. Frontend Setup

cd frontend
npm install
npm run dev
🐳 Docker Setup (Compiler)
Ensure your compiler-server runs securely and consistently using Docker:

cd compiler-server
docker build -t oj-compiler .
docker run -p 5001:5001 oj-compiler


🧠 AI Code Review
How it works:

User clicks “Submit with AI Review”

Code is evaluated for correctness

AI returns a review (e.g., feedback on logic, style, edge case handling)

Powered by:

Gemini API (Google Generative AI)


🔑 Environment Variables
.env example:

PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/onlinejudge
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
COMPILER_SERVER=http://localhost:5001

📡 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	Login + get auth token
GET	/api/problems	Get all problems
GET	/api/problems/:id	Get specific problem
POST	/api/problems/submit/:id	Submit code
GET	/api/submissions/:userId	Fetch user submissions
GET	/api/admin/problems	Admin: view all problems
POST	/api/admin/problems/add	Admin: create new problem
PUT	/api/admin/problems/:id	Admin: update problem
DELETE	/api/admin/problems/:id	Admin: delete problem

🧪 Verdict System
✅ AC – All test cases passed

❌ WA – Wrong Answer

🕒 TLE – Time Limit Exceeded

💥 RE – Runtime Error

⚙️ CE – Compilation Error


🖼 Screenshots

Problem submission flow

AI feedback panel

Admin dashboard

User dashboard with streaks


🙌 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change. Always include tests and follow consistent styling.

Built by Sarvagya Tiwari with ❤️ using MERN + Docker + AI
