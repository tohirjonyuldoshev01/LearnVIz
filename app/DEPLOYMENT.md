# LearnViz - Deployment Guide

Complete instructions for deploying LearnViz to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase project set up with Firestore and Auth
- [ ] OpenAI API key obtained and added
- [ ] Tests passing
- [ ] No console errors
- [ ] All features tested locally
- [ ] Security review completed
- [ ] Performance optimizations applied

## Environment Setup

### 1. Firebase Setup

#### Create a Firebase Project
1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Go to console"
3. Click "Add project"
4. Enter project name and continue
5. Skip Google Analytics (optional)
6. Click "Create project"

#### Enable Authentication
1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Select "Email/Password"
4. Enable and save

#### Create Firestore Database
1. Click "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode"
4. Choose region closest to your users
5. Click "Enable"

#### Set Firestore Security Rules
1. Go to "Firestore Database"
2. Click "Rules" tab
3. Replace with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow create: if request.auth.uid == uid;
    }
    match /diagrams/{diagramId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.createdBy;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.createdBy;
      allow update: if request.auth.uid == resource.data.createdBy;
    }
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

#### Get Firebase Config
1. Click "Project settings" (gear icon)
2. Click "General" tab
3. Copy Firebase config values

### 2. OpenAI API Setup

1. Create account at [openai.com](https://openai.com)
2. Go to [API keys](https://platform.openai.com/api-keys)
3. Click "Create new secret key"
4. Copy and save securely

### 3. Environment Configuration

Create `.env.local`:
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxx

# App
NEXT_PUBLIC_API_URL=https://yourdomain.com
NODE_ENV=production
```

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

**Easiest and fastest deployment**

#### Prerequisites
- Vercel account (free at vercel.com)
- GitHub account

#### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/learnviz.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel dashboard, go to "Settings"
   - Click "Environment Variables"
   - Add all variables from `.env.local`
   - **Do NOT include "NEXT_PUBLIC_" prefix here**

4. **Deploy**
   - Vercel automatically deploys on push
   - View deployment at `yourdomain.vercel.app`

#### Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Add your domain
3. Update DNS records
4. Verify

### Option 2: Deploy to Netlify

#### Steps

1. **Build locally**
```bash
npm run build
```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site"
   - Connect to GitHub
   - Select repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`

3. **Add Environment Variables**
   - Go to "Site settings"
   - Click "Build & deploy"
   - Add environment variables

### Option 3: Deploy to Docker/Cloud Run

#### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Deploy to Google Cloud Run
```bash
# Install Google Cloud CLI
# Initialize Google Cloud
gcloud init

# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/learnviz

# Deploy
gcloud run deploy learnviz \
  --image gcr.io/PROJECT_ID/learnviz \
  --set-env-vars="OPENAI_API_KEY=xxx,etc"
```

### Option 4: Deploy to AWS

#### Using Amplify

```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

#### Using EC2/ECS
1. Create EC2 instance
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Set environment variables
6. Run `npm run build && npm start`

## Post-Deployment

### 1. Health Checks
```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{"status":"ok","message":"API is running"}
```

### 2. Test Core Features
- [ ] User registration works
- [ ] Login functions properly
- [ ] Create diagram without errors
- [ ] AI content generation works
- [ ] Export functionality works
- [ ] Data persists in Firestore

### 3. Monitor Performance
- Set up error tracking (Sentry, Rollbar)
- Monitor API response times
- Track user engagement
- Set up uptime monitoring

### 4. Security Hardening

**Enable HTTPS**
- Vercel/Netlify: Automatic
- Self-hosted: Use Let's Encrypt

**Set Security Headers**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};
```

## Scaling for Production

### Database Optimization
- Index frequently queried fields
- Archive old diagrams
- Implement pagination
- Use caching

### Performance Optimization
- Enable data compression
- Use CDN for static assets
- Implement request caching
- Optimize images

### Cost Optimization
- Use Firebase Spark Plan if low usage
- Implement request throttling
- Monitor OpenAI API usage
- Set API spending limits

## Backup and Recovery

### Firebase Backups
1. Enable automatic backups in Firebase Console
2. Export data regularly:
```bash
gcloud firestore export gs://bucket-name/backups/backup-$(date +%s)
```

### Environment Variables
- Keep backup of all environment variables
- Store in secure password manager
- Use secrets management (1Password, LastPass)

## Monitoring and Logging

### Set Up Monitoring
```bash
# Using Google Cloud Monitoring
gcloud monitoring create-alert-policy ...

# Using Vercel Analytics (built-in)
# Dashboard → Analytics
```

### Error Tracking
```bash
# Add Sentry for error tracking
npm install @sentry/nextjs
```

## Troubleshooting Deployment

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environmental Variable Issues
- Verify all required variables are set
- Check for typos
- Ensure no extra spaces

### API Connection Issues
- Verify Firebase credentials
- Check Firestore Rules
- Confirm OpenAI API key validity

### Performance Issues
- Check build output
- Monitor database queries
- Reduce API response size

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Find previous successful deployment
3. Click "..." menu
4. Select "Promote to Production"

### Netlify
1. Go to Deploys
2. Find previous deployment
3. Click "Publish deploy"

## Support and Maintenance

### Regular Tasks
- Monthly security updates
- Quarterly performance review
- Weekly error log review
- Monthly cost analysis

### Maintenance Window
Plan 2-3 hours monthly for:
- Dependency updates
- Security patches
- Performance optimization
- Database optimization

---

**Deployment Complete! Your LearnViz instance is live. 🚀**
