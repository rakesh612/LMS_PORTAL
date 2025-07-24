# 🎓 EduCore – A Full-Featured LMS Platform
![App Screenshot](preview.png)

EduCore is a Learning Management System (LMS) built using the **MERN stack** that enables seamless online learning and teaching. The platform supports multiple user roles: **Students**, **Instructors**, and **Admins**, each with dedicated dashboards and capabilities.
## 🚀 Features
### 👨‍🎓 Student Dashboard
- Browse and **purchase courses** using **Razorpay**.
- Track **course progress**.
- Access:
  - **Video lessons**
  - **Downloadable files**
  - **Quizzes** (MCQs and theory questions)

### 👩‍🏫 Instructor Dashboard
- Create and manage **courses and lessons**.
- Upload:
  - **Video content** (stored on **AWS S3**)
  - **Lesson files**
  - **Quizzes**
- View:
  - **Total income**
  - **Enrolled students**

### 🛡️ Admin Dashboard
- Review and **approve instructor verification requests** before they can publish courses.


## 🧰 Tech Stack
- **Frontend:** React, Tailwind CSS, Zustand
- **Backend:** Node.js, Express.js, MongoDB
- **Cloud Storage:** AWS S3 (for video & file uploads)
- **Payments:** Razorpay


## ⚙️Installation

Follow these steps to set up and run the Collaborative Code Editor on your local machine.


### 1. Clone the Repository

```bash
git clone https://github.com/Gaurav5002/LMS-Platform.git
cd LMS-Platform
```
### 2. Install dependencies: Both directories

```bash
npm install
```
### 3. Start the servers 
- Frontend
```bash
cd frontend
npm run dev
```
- Backend
```bash
cd backend
npm run dev
```
### 5. Configure Environment variables
- Backend
```bash
PORT=your_port
CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
GOOGLE_CLIENT_ID=your_google_client_id
AWS_REGION=your_aws_region
ACCESS_KEY_ID=your_aws_access_key_id
SECRET_ACCESS_KEY=your_aws_secret_access_key
BUCKET_NAME=your_s3_bucket_name
RazorPay_Key=your_razorpay_key
RazorPay_Secret=your_razorpay_secret
```
- Frontend
```bash
VITE_API_BASE_URL=http://localhost:5001/api/auth
VITE_API_USER_URL=http://localhost:5001/api/users
VITE_API_PAYMENT_URL=http://localhost:5001/api/payments
VITE_API_FILE_URL=http://localhost:5001/api/fileUpload
VITE_API_ADMIN_URL=http://localhost:5001/api/admin
VITE_GOOGLE_CLIENT_ID=your GOOGLE_CLIENT_ID
VITE_RAZORPAY_KEY=your RazorPay_Key
```

### 4. Access the application:
```bash
http://localhost:5173/
```

