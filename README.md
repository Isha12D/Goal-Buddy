# 🎯 GoalBuddy – Real-Time Goal Tracking Platform

GoalBuddy is a full-stack web project that helps users set personal and shared goals, track progress visually and stay accountable through real-time chat and interactions. It combines productivity tools with social collaboration for better goal consisten

---

## 🚀 Features

- User Authentication (JWT + Refresh Tokens)
- Personal & Friends Goals Management
- Real-time Chat using Socket.io
- Real-time goal card exchange using Socket.io
- Goal scheduling & status tracking
- Analytics Dashboard (progress tracking, streak heatmaps, rankings) using Chart.js
- Profile management with images

---

## 🧩 Tech Stack

### Frontend
- **React(Vite) + JavaScript**
- **Tailwind CSS**
- **Material UI**
- **Chart.js**

### Backend
- **Node.js**
- **Express.js**
- **Socket.io**
- **MongoDB + Mongoose**
- **JWT Authentication**

---

## 📂 Project Structure
```
root
│
├── Frontend
│ ├── src
│ │ ├── Components/
| | ├── Context/
│ │ ├── Pages/
│ │ ├── utils/
│ │ ├── App.jsx
│ └── package.json
│
├── Backend/
├── models/
│   ├── users.js
│   ├── goals.js
│   └── messages.js
├── controllers/
├── routes/
├── socket/
├── middleware/
├── utility/
└── index.js
```

---

## 🧠 Core Entities

- User (GoalBuddy) – stores profile and authentication data
- Goal – personal or shared goals with status, timestamps, winners, etc. info
- Message – real-time chat between users

---

## 🔄 Workflow

- User signs up/logs in
- Creates personal or shared goals
- Chats in real-time with friends using Socket.io
- Collaborate with friends by setting a goal (using Socket.io)
- The firrst one to complete the goal, will be updated as 'winner' in the db
- Goal progress updates dynamically
- Analytics visualize performance (streaks, rankings, completion status)

---

## ✨ How It Solves the Problem

GoalBuddy blends goal management with real-time social accountability. Instead of working alone, users collaborate, communicate instantly and track progress visually—leading to better consistency, motivation and engagement.

---

## ⚡ Why MongoDB & Socket.io ?

- MongoDB handles flexible goal structures, real-time data updates and scalability
- Socket.io enables instant messaging and live updates without page refresh
- Together they support real-time, interactive user experiences

---

## 📊 Use of Chart.js

- Goal completion status tracking
- Streak heatmaps for consistency
- Ranking system for shared goals
- Visual progress dashboards

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Isha12D/Goal-Buddy
cd goal-buddy
```

### 2️⃣ Backend Setup
```bash
cd Backend
npm install
```

- Create `.env` file
```bash
PORT=3006
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_secret
```

- Run Backend Server
```bash
npm run dev
```

- Backend will start at:
```
http://localhost:3006
```

### 3️⃣ Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
- Frontend will run at:
```
http://localhost:5174
```

---

## 🎥 Project Demo Video:
```
https://drive.google.com/file/d/1lc8Er5XRNjqXSiOqG6IGaXIaE4dMD7Vh/view?usp=sharing
```

---

## 👨‍💻 Creator

Built from scratch with lots of tea ☕, code 💻, a few tears 😭 and a love for cartoon-style UI 🎨
by [Isha Doifode]

---

## 🔮 Future Enhancements
- Voice & Video Calls for accountability sessions
- Push notifications, on mobile notifications
- AI-based goal recommendations