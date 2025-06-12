# 🧑‍💼 Job-Board-Platform

This is a full-featured **Job Board Application** built using **Node.js, Express, and MongoDB**. It allows **employers** to post job listings and **job seekers** to search, apply for jobs, and track their application status. The platform supports user role authorization, resume uploads, email-based verification, password recovery, and more.

---

## Heroku Link

---

## 🚀 Features

- ✅ **User Authentication** (Login, Register, JWT, Cookies)
- 👥 **Role-Based Access** (admin, employer, user)
- 📄 **Job Listings** – Employers can create, update, delete job posts.
- 🔎 **Job Search** – Users can view available jobs.
- 📎 **Resume Upload** – Applicants can upload their resume.
- 📨 **Apply for Jobs** – Users can apply to listed jobs.
- 📊 **Application Tracking** – Track job application status (e.g., applied, reviewed, interviewed).
- 🔐 **Password Reset & Email Verification** using NodeMailer.
- 📬 **Email Code Delivery** for password reset and verification.
- ⚙️ **Security** – Helmet, Rate Limiting, XSS protection.

---

## 📁 Project Structure

```bash
src/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
└── index.js

````

---

## 🛠 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/job-board-platform.git
cd job-board-platform
```

### 2. Initialize & Install Dependencies

```bash
npm init -y
npm install express nodemon bcrypt body-parser cookie-parser dotenv express-async-handler cors crypto helmet express-rate-limit joi jsonwebtoken mongoose multer nodemailer xss-clean
```

### Create .env File

Since .env and node_modules are not included in the repo, you must create a .env file in the root:

```env
PORT=5000
JWT_SECRET_TOKEN=your_jwt_secret
CONNECTION_STRING=your_mongodb_connection_string
NODE_CODE_SENDING_EMAIL_ADDRESS=your_email@gmail.com
NODE_CODE_SENDING_EMAIL_PASSWORD=your_email_password_or_app_password
HMAC_VERIFICATION_CODE_SECRET=your_hmac_secret
```

🔐 Do NOT commit .env to version control. Use .gitignore to exclude it.

### 4. Add Development Script

```json
 "scripts": {
  "dev": "nodemon src/index.js"
}
```

## 🧪 Testing

- Use Postman to test all API endpoints:
- Register/Login
- Role-based access (admin, employer, user)
- Job creation (POST /api/jobs)
- Apply for job (POST /api/applications)
- Password reset and verification (handled via email using NodeMailer)

## 📦 Available Endpoints (Sample)

- POST /api/auth/register – Register a new user
- POST /api/auth/login – Login user
- POST /api/jobs/ – Create job listing (Employer only)
- GET /api/jobs/ – View all jobs
- POST /api/applications/ – Apply for a job
- PATCH /api/applications/:id/status – Update application status (Employer)
- POST /api/auth/forgot-password – Send reset code
- POST /api/auth/verify-forgot-password – Verify code for password reset

## 📧 Password Reset & Verification Flow

- User initiates password reset.

- NodeMailer sends a 6-digit verification code to the user's email.

- User submits code to verify.

- Password reset endpoint allows new password submission.

## 🔐 Security Features

- helmet – Secures HTTP headers

- express-rate-limit – Limits repeated requests

- xss-clean – Prevents cross-site scripting

- cors – Manages cross-origin access

## 🙋‍♂️ Author

Built with ❤️ by LordMonM
