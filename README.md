# 🧠 BrainBuddies — Backend API

> Collaborative EdTech Platform — REST API & Real-time Server

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)

---

## 📁 Project Structure

```
PRIMEWORLDMEDIA-BACKEND/
├── dist/                        # Compiled TypeScript output
├── lib/
│   ├── dto/                     # Data Transfer Objects
│   ├── enums/                   # Enumerations & constants
│   ├── http-response/           # Standardized HTTP response helpers
│   ├── i18n/                    # Internationalization (multi-language support)
│   ├── mailer/                  # Email service (Nodemailer / SMTP)
│   ├── models/                  # Mongoose data models
│   ├── schemas/                 # MongoDB schemas
│   ├── sms/                     # SMS service integration
│   └── utils/                   # Shared utility functions
├── src/
│   ├── dao/                     # Data Access Objects (DB layer)
│   ├── middlewares/             # Auth, validation, error-handling middleware
│   ├── routes/                  # Express route definitions
│   ├── static/                  # Static file serving
│   ├── utils/                   # Business logic utilities
│   ├── views/                   # Server-side view templates (if any)
│   └── index.ts                 # Application entry point
├── uploads/                     # User uploaded files (notes, resources)
├── .env                         # Environment variables (not committed)
├── .env.api.example             # Sample environment config
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Language | TypeScript |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Auth | JWT (JSON Web Tokens) |
| Email | Nodemailer |
| SMS | Twilio / Custom SMS Service |
| File Upload | Multer |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/brainbuddies-backend.git
cd brainbuddies-backend

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.api.example .env
# Edit .env with your actual config values

# 4. Run in development mode
npm run dev

# 5. Build for production
npm run build

# 6. Run in production
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file at the root. Refer to `.env.api.example` for all required keys.

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/brainbuddies

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email (Mailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS
SMS_API_KEY=your_sms_api_key

# File Upload
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=10mb
```

---

## 📡 API Modules

### 🔑 Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user profile |

### 💬 Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat/rooms` | Get all chat rooms |
| POST | `/api/chat/rooms` | Create new chat room |
| GET | `/api/chat/rooms/:id/messages` | Get messages for a room |

### 🏆 Contests
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/contests` | List all contests |
| POST | `/api/contests` | Create a contest (admin) |
| POST | `/api/contests/:id/join` | Join a contest |
| GET | `/api/contests/:id/leaderboard` | Get leaderboard |

### 📝 Notes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Upload new note |
| GET | `/api/notes/:id` | Get single note |
| DELETE | `/api/notes/:id` | Delete a note |

### 📚 Library
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/library` | Get all books/resources |
| GET | `/api/library/:subject` | Get resources by subject |

### 🙋 Volunteer / Doubt Solving
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/volunteers` | Get volunteer list with rankings |
| POST | `/api/volunteers/apply` | Apply as a volunteer |
| POST | `/api/doubts` | Post a doubt |
| POST | `/api/doubts/:id/answer` | Answer a doubt |

### 📋 Feedback
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/feedback` | Submit platform feedback |
| GET | `/api/feedback` | Get all feedback (admin) |

---

## 🔄 Real-time Events (Socket.io)

```
Client connects → socket.io handshake with JWT

Events:
  join_room       → Join a chat room
  leave_room      → Leave a chat room
  send_message    → Send message to room
  receive_message → Receive message from room
  typing          → Typing indicator
  stop_typing     → Stop typing indicator
  online_users    → Get online user list
  quiz_start      → Contest/quiz started
  quiz_answer     → Submit quiz answer
```

---

## 🗄️ Data Models

### User
```typescript
{
  _id, name, email, password (hashed),
  role: "student" | "volunteer" | "admin",
  squad: ObjectId,
  score: number,
  createdAt, updatedAt
}
```

### ChatRoom
```typescript
{
  _id, name, type: "squad" | "public",
  members: [ObjectId],
  messages: [{ sender, content, timestamp }],
  createdAt
}
```

### Note
```typescript
{
  _id, title, subject, fileUrl,
  uploadedBy: ObjectId,
  verified: boolean,
  downloads: number,
  createdAt
}
```

### Contest
```typescript
{
  _id, title, questions: [...],
  participants: [ObjectId],
  leaderboard: [{ user, score }],
  startTime, endTime
}
```

---

## 🛡️ Middleware

| Middleware | Purpose |
|---|---|
| `authMiddleware` | Validates JWT, protects routes |
| `roleMiddleware` | Role-based access control |
| `errorHandler` | Global error handling |
| `rateLimiter` | API rate limiting |
| `uploadMiddleware` | Multer file upload handling |
| `validationMiddleware` | Request body validation (DTOs) |

---

## 📦 Available Scripts

```bash
npm run dev       # Start development server with hot-reload (ts-node-dev)
npm run build     # Compile TypeScript to dist/
npm start         # Run compiled production build
npm run lint      # ESLint check
npm run format    # Prettier format
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

> Built with ❤️ for BrainBuddies — Empowering collaborative learning.