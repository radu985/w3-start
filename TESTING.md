# Portfolio Chat - Testing Checklist

## 🚀 Pre-Testing Setup

### 1. Environment Setup
- [ ] Copy `env.example` to `.env.local`
- [ ] Update `DATABASE_URL` with your PostgreSQL connection string
- [ ] Set a secure `JWT_SECRET`
- [ ] Verify `SOCKET_PORT` and `NEXT_PUBLIC_SOCKET_URL`

### 2. Database Setup
```bash
npm run db:generate
npm run db:push
npm run db:init
npm run test:setup
```

### 3. Start Servers
```bash
npm run dev:all
```

## 🧪 Functional Testing

### Portfolio Page (`http://localhost:3000/portfolio`)

#### Visual & Layout Testing
- [ ] Page loads without errors
- [ ] All sections are visible (About Me, Tech Stack, Projects, Contact)
- [ ] Animations work smoothly
- [ ] Responsive design works on different screen sizes
- [ ] Navigation links scroll to correct sections
- [ ] Icons and images display correctly

#### Content Testing
- [ ] About Me section shows correct information
- [ ] Tech Stack displays skills in categories
- [ ] Projects show featured and regular projects
- [ ] Contact information is accurate
- [ ] Social links work (GitHub, LinkedIn, etc.)

### Chat Functionality

#### Basic Chat Testing
- [ ] Chat button appears in bottom-right corner
- [ ] Clicking chat button opens chat window
- [ ] Chat window has proper animations
- [ ] Can type and send messages
- [ ] Messages appear in chat history
- [ ] Timestamps are displayed correctly

#### Real-time Features
- [ ] Multiple browser tabs can connect
- [ ] Messages appear in all connected tabs
- [ ] Typing indicators work
- [ ] Online user count updates
- [ ] User join/leave notifications appear
- [ ] Minimize/maximize functionality works

#### Chat UI Testing
- [ ] Chat window can be minimized
- [ ] Chat window can be maximized
- [ ] Close button works
- [ ] Scroll works for long message history
- [ ] Input field clears after sending message

### Admin Authentication (`http://localhost:3000/admin`)

#### Login Testing
- [ ] Login page loads correctly
- [ ] Form validation works (empty fields)
- [ ] Invalid credentials show error message
- [ ] Valid credentials redirect to dashboard
- [ ] Password visibility toggle works
- [ ] Demo credentials are displayed

#### Authentication Flow
- [ ] Login with admin@portfolio.com / admin123
- [ ] Redirects to dashboard after successful login
- [ ] Token is stored in localStorage
- [ ] User data is stored in localStorage

### Admin Dashboard (`http://localhost:3000/admin/dashboard`)

#### Access Control
- [ ] Direct access to dashboard without login redirects to login
- [ ] Logout clears authentication data
- [ ] Logout redirects to login page

#### Dashboard Overview
- [ ] Stats cards display correct numbers
- [ ] Navigation sidebar works
- [ ] Quick action buttons function
- [ ] User info displays correctly

#### Navigation Testing
- [ ] All navigation tabs work
- [ ] Active tab is highlighted
- [ ] Content changes when switching tabs

## 🔌 API Testing

### Public APIs
```bash
# Test these endpoints return data
curl http://localhost:3000/api/portfolio
curl http://localhost:3000/api/skills
curl http://localhost:3000/api/projects
curl http://localhost:3000/api/messages
```

### Admin APIs (require authentication)
```bash
# First get a token by logging in
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"admin123"}'

# Use the token in subsequent requests
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/portfolio
```

## 🗄️ Database Testing

### Prisma Studio
```bash
npm run db:studio
```
- [ ] Can view all tables
- [ ] Data is present in all tables
- [ ] Relationships work correctly

### Data Verification
- [ ] Admin user exists with correct role
- [ ] Portfolio data is present
- [ ] Skills are categorized correctly
- [ ] Projects have featured flags
- [ ] Messages table is accessible

## 🐛 Error Testing

### Network Errors
- [ ] Disconnect database - check error handling
- [ ] Stop socket server - check chat error handling
- [ ] Invalid API calls - check error responses

### Authentication Errors
- [ ] Expired tokens
- [ ] Invalid tokens
- [ ] Missing tokens
- [ ] Wrong user roles

### Form Validation
- [ ] Empty required fields
- [ ] Invalid email formats
- [ ] Password requirements
- [ ] File upload limits (if applicable)

## 📱 Responsive Testing

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large screens (2560x1440)

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## ⚡ Performance Testing

### Load Testing
- [ ] Page load times under 3 seconds
- [ ] Chat messages appear instantly
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks in chat

### Stress Testing
- [ ] Multiple chat users (10+)
- [ ] Long message history
- [ ] Rapid message sending
- [ ] Multiple admin sessions

## 🔒 Security Testing

### Authentication Security
- [ ] Passwords are hashed
- [ ] JWT tokens are secure
- [ ] Admin routes are protected
- [ ] Session management works

### Data Security
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Input validation

## 🚀 Deployment Testing

### Build Testing
```bash
npm run build
npm run start
```
- [ ] Application builds successfully
- [ ] Production server starts
- [ ] All features work in production mode

### Environment Testing
- [ ] Environment variables are loaded
- [ ] Database connection works
- [ ] Socket server connects
- [ ] Admin authentication works

## 📋 Test Results Template

```
Test Date: _______________
Tester: _________________

✅ Passed Tests:
- 

❌ Failed Tests:
- 

🐛 Bugs Found:
- 

📝 Notes:
- 

Overall Status: ✅ PASS / ❌ FAIL
```

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL and PostgreSQL status
2. **Socket Connection**: Verify both servers are running
3. **Build Errors**: Clear .next folder and reinstall dependencies
4. **Authentication**: Check JWT_SECRET and token expiration

### Debug Commands
```bash
# Check database
npm run db:studio

# Test setup
npm run test:setup

# Clear cache
rm -rf .next
npm run build

# Check logs
npm run dev:all
``` 