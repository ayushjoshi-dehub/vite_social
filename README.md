# Social Media Platform

A full-stack social media application built with React, Node.js, Express, and MongoDB. Features include user authentication, posts, stories, reels, and real-time notifications.
https://ayushjoshi-dehub.github.io/vite_social

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication** - Sign up, login, and password recovery
- **Posts** - Create, edit, delete, and like posts
- **Stories** - Share temporary stories that disappear after 24 hours
- **Reels** - Short-form video content
- **User Profiles** - View and edit user profiles
- **Search** - Find users and content
- **Real-time Notifications** - Get instant updates
- **Offline Support** - Continue using the app offline
- **Dark/Light Theme** - Customizable UI theme

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File upload handling

## 📁 Project Structure

```
socialmedia/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── redux/           # Redux store and slices
│   │   ├── services/        # API service layer
│   │   ├── assets/          # Images and static files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                  # Express backend API
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middlewares/         # Custom middlewares
│   ├── utils/               # Utility functions
│   ├── index.js             # Entry point
│   ├── index-production.js  # Production entry point
│   └── package.json
│
├── package.json             # Root package.json
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd socialmedia
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

## ▶️ Running the Application

### Option 1: Run Frontend and Backend Separately (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000` (or the port defined in your config)

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`

### Option 2: Run Both Concurrently

First, install `concurrently` in the root directory:
```bash
npm install concurrently --save-dev
```

Update the root `package.json` with:
```json
"scripts": {
  "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
  "build": "npm --prefix backend run build && npm --prefix frontend run build",
  "start": "node backend/index-production.js"
}
```

Then run:
```bash
npm run dev
```

## 🔑 Environment Variables

### Backend (.env in backend directory)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialmedia
# or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/socialmedia

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

NODE_ENV=development
```

### Frontend (.env in frontend directory)
```
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Routes
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/suggested` - Get suggested users
- `GET /api/users` - Get all users

### Post Routes
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like a post

### Story Routes
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create new story
- `DELETE /api/stories/:id` - Delete story

### Reels Routes
- `GET /api/reels` - Get all reels
- `POST /api/reels` - Create new reel

## 📝 Available Scripts

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Backend
```bash
npm run dev        # Start with nodemon (auto-reload)
npm start          # Start production server
npm run build      # Build script
```

## 🐛 Troubleshooting

### npm run dev not working
- Make sure you're in the correct directory (frontend or backend)
- Delete `node_modules` folder and run `npm install` again
- Check if Node.js is properly installed: `node --version`

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your MongoDB Atlas credentials
- Verify the `MONGODB_URI` in your `.env` file

### Port Already in Use
- Change the port in your backend config or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


