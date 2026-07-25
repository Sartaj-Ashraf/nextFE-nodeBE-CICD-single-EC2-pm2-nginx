# DevOps Deployment Guide

## Overview

This project is a full-stack web application deployed to a single AWS EC2 instance using GitHub Actions CI/CD pipeline, PM2 process manager, and Nginx reverse proxy.

### Architecture

```
GitHub Actions (CI/CD)
    ↓
AWS EC2 Instance
    ├── PM2 Process Manager
    │   ├── Frontend (Next.js) - Port 3006
    │   └── Backend (Node.js/Express) - Port 5006
    └── Nginx Reverse Proxy (Port 80)
        └── Domain: sartaj.space
```

## Tech Stack

### Frontend
- **Framework**: Next.js 15.3.2 (React 19)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Build Mode**: Standalone output

### Backend
- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Database**: MongoDB
- **File Storage**: Cloudinary
- **Authentication**: JWT

### Infrastructure
- **Server**: AWS EC2
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions

## Deployment Architecture

### 1. CI/CD Pipeline (GitHub Actions)

**Trigger**: Push to `staging` branch

**Workflow**: `.github/workflows/cd_staging.yaml`

**Stages**:
1. **Build & Compile**
   - Checkout code
   - Setup Node.js 22
   - Install dependencies (backend & frontend)
   - Build frontend with environment variables
   - Create deployment artifact (release.tar.gz)

2. **Deploy to EC2**
   - Download artifact
   - Upload to EC2 via SCP
   - Extract and deploy via SSH
   - Health checks
   - PM2 process management
   - Cleanup old releases

### 2. EC2 Server Structure

```
~/apps/portfolio/
├── releases/              # Timestamped release directories
│   ├── 20240125120000/
│   ├── 20240125130000/
│   └── ...
├── shared/               # Shared configuration
│   ├── .env.backend
│   └── .env.frontend
└── current -> releases/[latest]  # Symlink to active release
```

### 3. PM2 Process Management

**Applications**:
- `portfolio-backend`: Node.js/Express server (Port 5006)
- `portfolio-frontend`: Next.js standalone server (Port 3006)

**Features**:
- Automatic restart on failure
- Systemd integration for persistence
- Health check validation

### 4. Nginx Configuration

**File**: `nginx/nginx-stage.conf`

**Configuration**:
- Listens on port 80
- Domain: sartaj.space
- Frontend proxy: `localhost:3006`
- API proxy: `localhost:5006` (path: `/api/`)
- Proper headers (X-Real-IP, X-Forwarded-For, etc.)

## Deployment Process

### Automatic Deployment

1. Push code to `staging` branch
2. GitHub Actions triggers automatically
3. Build process creates optimized artifact
4. Deployment to EC2 with health checks
5. PM2 restarts services
6. Old releases are cleaned up (keeps last 5)

### Manual Deployment Steps

If you need to deploy manually:

```bash
# 1. SSH into EC2
ssh -i your-key.pem user@your-ec2-ip

# 2. Navigate to app directory
cd ~/apps/portfolio

# 3. Pull latest code (if using git on server)
git pull origin staging

# 4. Install dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# 5. Restart PM2 processes
pm2 restart portfolio-backend portfolio-frontend

# 6. Save PM2 configuration
pm2 save
```

## Environment Variables

### Required GitHub Secrets

Configure these in your GitHub repository settings:

- `STAGING_SERVER_IP`: EC2 instance IP address
- `STAGING_SERVER_USER`: SSH username (e.g., ubuntu)
- `EC2_SSH_PRIVATE_KEY`: Private SSH key for EC2 access


### Server Environment Variables

Environment variables are stored in:
- `~/apps/portfolio/shared/.env.backend` (Backend)
- `~/apps/portfolio/shared/.env.frontend` (Frontend)

These are symlinked into each release during deployment.

## Local Development

### Prerequisites
- Node.js 22
- MongoDB (local or Atlas)
- npm or yarn

### Setup

```bash
# Clone repository
git clone <repository-url>
cd nextFE-nodeBE-CICD-single-EC2-pm2-nginx

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment variables
# Copy .env.example files and fill in your values

# Run development servers
cd backend
npm run dev  # Backend on port 5100

# In another terminal
cd frontend
npm run dev  # Frontend on port 3000
```

### Development Scripts

**Backend**:
- `npm run server` - Start backend with nodemon
- `npm run client` - Start frontend dev server
- `npm run dev` - Run both concurrently

**Frontend**:
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Monitoring & Management

### PM2 Commands

```bash
# View all processes
pm2 status

# View logs
pm2 logs portfolio-backend
pm2 logs portfolio-frontend

# Restart specific process
pm2 restart portfolio-backend

# Stop specific process
pm2 stop portfolio-backend

# Monitor real-time metrics
pm2 monit

# View process details
pm2 describe portfolio-backend
```

### Nginx Management

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo nginx -s reload

# Restart Nginx
sudo systemctl restart nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Checks

**Backend**: `http://your-domain/api/v1/health`
**Frontend**: `http://your-domain/`

## Rollback Procedure

The deployment pipeline includes automatic rollback on failure. For manual rollback:

```bash
# SSH into server
ssh user@your-ec2-ip

# Navigate to app directory
cd ~/apps/portfolio

# List available releases
ls -la releases/

# Switch to previous release
ln -sfn releases/[timestamp] current

# Restart PM2 with previous release
pm2 restart portfolio-backend portfolio-frontend

# Verify health
curl http://localhost:5006/api/v1/health
curl http://localhost:3006
```

## Security Considerations

1. **SSH Keys**: Use SSH key authentication, disable password auth
2. **Firewall**: Configure security groups to allow only necessary ports (80, 443, 22)
3. **Environment Variables**: Never commit secrets to git, use GitHub Secrets
4. **HTTPS**: Configure SSL/TLS certificate (Let's Encrypt recommended)
5. **Updates**: Regularly update Node.js, npm packages, and system packages
6. **Backups**: Implement MongoDB backup strategy

## Troubleshooting

### Common Issues

**Deployment fails during health check**:
- Check PM2 logs: `pm2 logs`
- Verify ports are not in use: `netstat -tulpn`
- Check MongoDB connection

**Nginx 502 Bad Gateway**:
- Verify PM2 processes are running: `pm2 status`
- Check Nginx configuration: `sudo nginx -t`
- Review Nginx error logs

**Frontend build fails**:
- Verify Node.js version: `node -v`
- Check environment variables are set
- Clear Next.js cache: `rm -rf .next`

**Backend connection refused**:
- Verify MongoDB is accessible
- Check environment variables
- Review backend logs

## Scaling Considerations

Current setup uses a single EC2 instance. For scaling:

1. **Horizontal Scaling**: Add load balancer (ALB) + multiple EC2 instances
2. **Database**: Use MongoDB Atlas for managed scaling
3. **CDN**: Implement CloudFront for static assets
4. **Caching**: Add Redis for session caching
5. **Monitoring**: Implement CloudWatch or Datadog

## Cost Optimization

- Use EC2 instance types appropriate for workload
- Implement auto-scaling groups
- Use Reserved Instances for predictable workloads
- Optimize build artifacts size
- Implement proper log rotation

## Support & Maintenance

**Regular Tasks**:
- Monitor PM2 process health
- Review Nginx access/error logs
- Update dependencies monthly
- Check disk space usage
- Verify SSL certificate expiration
- Test backup restoration
