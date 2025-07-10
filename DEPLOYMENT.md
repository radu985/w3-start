# 🚀 Deployment Guide

This guide covers multiple deployment options for the Portfolio Chat application.

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Docker and Docker Compose (for containerized deployment)
- Git

## 🐳 Docker Deployment (Recommended)

### Quick Start with Docker Compose

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd portfolio-chat
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your production values
   ```

3. **Deploy with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Access your application:**
   - Main app: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Socket server: http://localhost:3001

### Production Docker Deployment

1. **Create production environment file:**
   ```bash
   cp env.example .env.production
   ```

2. **Update production environment variables:**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@host:5432/database
   JWT_SECRET=your-super-secret-jwt-key
   ADMIN_EMAIL=your-admin@email.com
   ADMIN_PASSWORD=secure-password
   ```

3. **Build and run production containers:**
   ```bash
   docker-compose -f docker-compose.yml --env-file .env.production up -d
   ```

## ☁️ Cloud Deployment Options

### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

### Railway Deployment

1. **Connect your GitHub repository to Railway**

2. **Add environment variables in Railway dashboard**

3. **Deploy automatically on push to main branch**

### DigitalOcean App Platform

1. **Create a new app in DigitalOcean**

2. **Connect your GitHub repository**

3. **Configure environment variables**

4. **Set build command:**
   ```bash
   npm run build
   ```

5. **Set run command:**
   ```bash
   npm start
   ```

## 🐙 Manual Server Deployment

### Ubuntu/Debian Server Setup

1. **Update system:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PostgreSQL:**
   ```bash
   sudo apt install postgresql postgresql-contrib -y
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

4. **Create database and user:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE portfolio_chat;
   CREATE USER portfolio_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE portfolio_chat TO portfolio_user;
   \q
   ```

5. **Clone and setup application:**
   ```bash
   git clone <your-repo-url>
   cd portfolio-chat
   npm install
   npm run build
   ```

6. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

7. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

8. **Start the application:**
   ```bash
   npm start
   ```

### Using PM2 for Process Management

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Create PM2 ecosystem file:**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [
       {
         name: 'portfolio-chat',
         script: 'npm',
         args: 'start',
         cwd: '/path/to/your/app',
         env: {
           NODE_ENV: 'production',
           PORT: 3000
         }
       },
       {
         name: 'portfolio-socket',
         script: 'node',
         args: 'socket/server.js',
         cwd: '/path/to/your/app',
         env: {
           NODE_ENV: 'production',
           PORT: 3001
         }
       }
     ]
   }
   ```

3. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## 🔒 SSL/HTTPS Configuration

### Using Let's Encrypt with Certbot

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Auto-renewal:**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Using Cloudflare

1. **Add your domain to Cloudflare**

2. **Update nameservers**

3. **Enable SSL/TLS encryption mode to "Full"**

4. **Create DNS records pointing to your server**

## 📊 Monitoring and Logging

### Application Monitoring

1. **Install monitoring tools:**
   ```bash
   npm install -g pm2
   pm2 install pm2-logrotate
   ```

2. **Set up log rotation:**
   ```bash
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 30
   ```

### Database Monitoring

1. **Enable PostgreSQL logging:**
   ```bash
   # Edit /etc/postgresql/15/main/postgresql.conf
   logging_collector = on
   log_directory = 'log'
   log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
   ```

2. **Restart PostgreSQL:**
   ```bash
   sudo systemctl restart postgresql
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

1. **Add secrets to your GitHub repository:**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `HOST` (server IP)
   - `USERNAME` (server username)
   - `KEY` (SSH private key)

2. **Push to main branch to trigger deployment**

### Manual Deployment Script

Create a deployment script:

```bash
#!/bin/bash
# deploy.sh

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Run database migrations
npx prisma migrate deploy

# Restart PM2 processes
pm2 restart all

echo "Deployment completed!"
```

## 🚨 Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Check firewall settings

2. **Port conflicts:**
   - Ensure ports 3000 and 3001 are available
   - Check for existing processes

3. **Permission errors:**
   - Ensure proper file permissions
   - Check user ownership

### Health Checks

1. **Application health:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Database health:**
   ```bash
   sudo -u postgres pg_isready
   ```

3. **Socket server health:**
   ```bash
   curl http://localhost:3001/health
   ```

## 📈 Performance Optimization

### Production Optimizations

1. **Enable gzip compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Optimize database queries**
5. **Use connection pooling**

### Monitoring Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Check database connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

## 🔐 Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Database backup strategy
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Verify environment configuration
4. Test database connectivity
5. Check network connectivity

---

**Happy Deploying! 🎉** 