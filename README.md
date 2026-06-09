# EventSphere 🎉

EventSphere is a full-stack event management platform that allows users to create, manage, and participate in events. The application includes user authentication, event management, media uploads, notifications, real-time updates, and an admin dashboard.

## 🌐 Live Demo

Frontend:
https://event-sphere-99c8i2xto-ayush-girhays-projects.vercel.app/

Backend API available on request.

---

## 🚀 Features

### User Features

* User Registration & Login
* JWT Authentication
* Create Events
* Edit Events
* Delete Events
* View All Events
* Event Participation
* Real-time Notifications
* Media Uploads
* User Dashboard

### Admin Features

* Manage Users
* Manage Events
* View Statistics
* Monitor Platform Activity

### Additional Features

* Cloudinary Image Upload
* Socket.IO Real-Time Communication
* Email Notifications
* Responsive UI
* Event Reminder Service

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Tailwind CSS
* Socket.IO Client
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Nodemailer
* Cloudinary
* Socket.IO

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📂 Project Structure

```bash
EventSphere/
│
├── client/          # React Frontend
├── server/          # Node.js Backend
├── face-service/    # Additional Services
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Ayush-Girhay/EventSphere.git
cd EventSphere
```

### Install Backend Dependencies

```bash
npm install
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Start Backend

```bash
npm start
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the server directory:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASS=your_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

---

## 📸 Screenshots

Add screenshots of:

* Home Page
* Login Page
* Dashboard
* Event Management
* Notifications
* Admin Panel

---

## 👨‍💻 Author

**Ayush Girhay**
B.Tech, IIT Roorkee

GitHub: https://github.com/Ayush-Girhay

---

## ## 📄 Acknowledgement

This project was developed as part of learning and development activities under the **CIG (Computer Interest Group), IIT Roorkee**.

EventSphere is an open-source academic project created to demonstrate full-stack web development concepts including authentication, event management, real-time communication, notifications, media handling, and cloud deployment.

Special thanks to **CIG, IIT Roorkee** for providing the platform and learning environment for this project.

