# Portfolio Chat App

A full-stack portfolio chat application built with Next.js and a custom Socket.io server. Includes user and admin chat interfaces, persistent sessions, admin controls, and more.

---

## Features
- Real-time chat (user & admin)
- Persistent customer identity
- Admin can delete sessions/history
- Color inversion toggle
- Modern UI/UX
- Socket.io server (custom, separate from Next.js)

---

## Getting Started

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd portfolio-chat
```

### 2. Install dependencies
```sh
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in the required values.

### 4. Development
- Start Next.js (dev mode):
  ```sh
  npm run dev
  ```
- Start the socket server (in a new terminal):
  ```sh
  cd socket
  node server.js
  ```

### 5. Production
- Build Next.js:
  ```sh
  npm run build
  ```
- Start Next.js:
  ```sh
  npm start
  ```
- Start the socket server (in a new terminal):
  ```sh
  cd socket
  node server.js
  ```

---

## Batch File Automation

To automate port cleanup, cache cleaning, and starting both servers, use the provided `start-project.bat` (see below for sample content):

```bat
@echo off
for %%p in (3000 3001) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p ^| findstr LISTENING') do (
        echo Killing process on port %%p with PID %%a
        taskkill /PID %%a /F
    )
)
if exist .next (
    echo Deleting .next build cache...
    rmdir /s /q .next
)
start cmd /k "npm run dev"
cd socket
start cmd /k "node server.js"
echo All done! Two new terminals should open for Next.js and the socket server.
pause
```

---

## Troubleshooting

### Port Already in Use
- If you see `EADDRINUSE`, a process is already using the port. Use the batch file above or manually kill the process.

### Cache/Module Errors
- If you see `MODULE_NOT_FOUND` or similar errors, delete the `.next` folder and rebuild:
  ```sh
  rmdir /s /q .next
  npm run build
  npm start
  ```

### Windows PowerShell '&&' Error
- Use separate commands or batch files instead of `&&` in PowerShell.

---

## Deployment
- Deploy Next.js to Vercel (frontend/backend API only)
- Deploy the socket server to Render, Railway, Fly.io, or a VPS
- Set `NEXT_PUBLIC_SOCKET_URL` in your environment variables to point to your deployed socket server

---

## License
MIT

## 🚀 Features

- **Portfolio Pages**: Beautiful, animated sections (About Me, Tech Stack, Projects, Contact)
- **Real-time Chat**: Socket.IO powered chat widget for client communication
- **Admin Dashboard**: Full CRUD operations for portfolio content management
- **Authentication**: Secure admin login with JWT tokens
- **Database**: PostgreSQL with Prisma ORM
- **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Socket.IO
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd portfolio-chat
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_chat"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Socket Server (optional)
SOCKET_PORT=3001
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Initialize with default data
npm run db:init
```

### 4. Start Development Servers

```bash
# Start both Next.js and Socket.IO servers
npm run dev:all

# Or start them separately:
npm run dev          # Next.js (port 3000)
npm run dev:socket   # Socket.IO (port 3001)
```

### 5. Access the Application

- **Portfolio**: http://localhost:3000/portfolio
- **Admin Login**: http://localhost:3000/admin
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## 🔐 Default Admin Credentials

- **Email**: admin@portfolio.com
- **Password**: admin123

## 🧪 Testing Guide

### 1. Portfolio Page Testing

1. **Visit Portfolio Page**
   - Navigate to http://localhost:3000/portfolio
   - Verify all sections load correctly
   - Check animations and responsiveness

2. **Test Navigation**
   - Click on navigation links (About Me, Tech Stack, Projects, Contact)
   - Verify smooth scrolling to sections

3. **Test Responsive Design**
   - Resize browser window
   - Test on mobile viewport
   - Verify all elements adapt properly

### 2. Chat Functionality Testing

1. **Open Chat Widget**
   - Click the chat button (bottom-right)
   - Verify chat window opens with animations

2. **Test Real-time Features**
   - Send messages
   - Test typing indicators
   - Verify online user count
   - Test minimize/maximize functionality

3. **Test Multiple Users**
   - Open multiple browser tabs/windows
   - Verify messages appear in all instances
   - Test user join/leave notifications

### 3. Admin Authentication Testing

1. **Login Test**
   - Navigate to /admin
   - Try invalid credentials (should show error)
   - Login with correct credentials
   - Verify redirect to dashboard

2. **Protected Routes**
   - Try accessing /admin/dashboard without login
   - Verify redirect to login page
   - Test logout functionality

### 4. API Testing

Test the following endpoints:

```bash
# Public APIs
GET /api/portfolio
GET /api/skills  
GET /api/projects
GET /api/messages

# Admin APIs (require authentication)
POST /api/auth/login
GET /api/admin/portfolio
PUT /api/admin/portfolio
GET /api/admin/skills
POST /api/admin/skills
PUT /api/admin/skills
DELETE /api/admin/skills?id=<skill_id>
GET /api/admin/projects
POST /api/admin/projects
PUT /api/admin/projects
DELETE /api/admin/projects?id=<project_id>
```

### 5. Database Testing

```bash
# Check database connection
npm run db:studio

# Verify data exists
# Check users, portfolio, skills, projects tables
```

## 🐛 Common Issues & Solutions

### 1. Database Connection Issues
```bash
# Verify DATABASE_URL in .env.local
# Ensure PostgreSQL is running
# Check database exists
```

### 2. Socket Connection Issues
```bash
# Verify SOCKET_PORT is not in use
# Check CORS settings in socket/server.js
# Ensure both servers are running
```

### 3. Build Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📁 Project Structure

```
portfolio-chat/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── api/               # API routes
│   ├── portfolio/         # Portfolio page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat components
│   └── portfolio/         # Portfolio components
├── lib/                   # Utilities
│   ├── auth.ts           # Authentication utilities
│   ├── auth-utils.ts     # Client auth utilities
│   ├── db.ts             # Database connection
│   ├── middleware.ts     # Next.js middleware
│   └── socket.ts         # Socket client
├── prisma/               # Database schema
├── socket/               # Socket.IO server
├── scripts/              # Database scripts
└── public/               # Static assets
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:socket       # Start Socket.IO server
npm run dev:all          # Start both servers

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
npm run db:init          # Initialize with default data

# Build & Deploy
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to Vercel

2. **Environment Variables**
   - Add DATABASE_URL
   - Add JWT_SECRET
   - Add NEXT_PUBLIC_SOCKET_URL

3. **Database**
   - Use Vercel Postgres or external PostgreSQL
   - Run database migrations

4. **Socket Server**
   - Deploy socket server separately (Railway, Heroku, etc.)
   - Update NEXT_PUBLIC_SOCKET_URL

### Railway Deployment

1. **Deploy Database**
   - Create PostgreSQL database
   - Get connection string

2. **Deploy Application**
   - Connect GitHub repository
   - Set environment variables
   - Deploy

## 📝 License

MIT License - feel free to use this project for your own portfolio!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub. 