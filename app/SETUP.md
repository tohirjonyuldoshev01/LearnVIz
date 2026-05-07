# LearnViz - Development Setup Guide

Complete guide to set up the project for local development.

## Prerequisites

### System Requirements
- Node.js 18.0 or higher
- npm 9.0 or higher (or yarn 3.0+)
- Git
- Code editor (VS Code recommended)
- 2GB RAM minimum
- 100MB disk space

### Check Installation
```bash
node --version  # Should be v18.0.0+
npm --version   # Should be 9.0.0+
git --version   # Should be 2.0.0+
```

## Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/your-username/learnviz.git
cd learnviz/app
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Environment

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:

#### Firebase Configuration
1. Create Firebase project
2. Get config from Firebase Console → Settings → General
3. Add to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaYour_Firebase_API_Key_Here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourproject-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

#### OpenAI Configuration
1. Create OpenAI API key
2. Add to `.env.local`:

```
OPENAI_API_KEY=sk-your_openai_api_key_here
```

#### Local Development
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

App runs at `http://localhost:3000`

### 5. Verify Installation

1. Open http://localhost:3000
2. You should see the LearnViz homepage
3. Try registering a test account
4. Create a test diagram

## Firebase Setup for Development

### Create Firebase Project

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Get Started"
3. Create new project
4. Enable Google Analytics (optional)
5. Create project

### Enable Authentication

1. In Firebase Console → Authentication
2. Click "Get Started"
3. Select "Email/Password" provider
4. Enable "Email/Password"
5. Save

### Create Firestore Database

1. Firebase Console → Firestore Database
2. Click "Create Database"
3. Select "Start in test mode"
4. Choose storage region
5. Click "Enable"

### Configure Firestore Rules

1. Go to Firestore → Rules tab
2. Replace default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /diagrams/{diagramId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow write: if request.auth.uid == resource.data.createdBy;
      allow delete: if request.auth.uid == resource.data.createdBy;
    }
  }
}
```

3. Click "Publish"

## Common Development Tasks

### Install New Package
```bash
npm install package-name
npm install --save-dev dev-package-name
```

### Run TypeScript Type Check
```bash
npm run type-check
```

### Run Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Build for Production
```bash
npm run build
npm start  # Test production build
```

## Project Structure Guide

```
src/
├── app/              # Next.js app router pages
│   ├── api/         # API routes
│   ├── auth/        # Auth pages
│   ├── dashboard/   # Dashboard
│   └── diagram/     # Diagram pages
├── components/      # React components
│   ├── diagrams/    # Diagram components
│   ├── ui/          # UI components
│   └── layout/      # Layout components
├── hooks/           # Custom hooks
├── lib/             # Utilities and config
├── services/        # API services
├── store/           # State management
├── types/           # TypeScript types
├── utils/           # Helper functions
└── styles/          # CSS/styles
```

## Development Workflow

### Create New Feature

1. Create feature branch
```bash
git checkout -b feature/my-feature
```

2. Make changes
3. Test locally
4. Commit changes
```bash
git add .
git commit -m "Add new feature"
```

5. Push and create PR
```bash
git push origin feature/my-feature
```

### Debug Issues

#### For React Issues
- Use React DevTools browser extension
- Check browser console
- Check Network tab

#### For Firebase Issues
- Check Firebase Console logs
- Verify security rules
- Check auth state in console

#### For API Issues
- Check Network tab in DevTools
- Verify environment variables
- Check API response format

## Testing

### Manual Testing Checklist

- [ ] Create account with different roles
- [ ] Login/logout works
- [ ] Create diagrams of each type
- [ ] AI content generates
- [ ] Edit diagrams
- [ ] Save diagrams
- [ ] Export as PNG/PDF
- [ ] Delete diagrams
- [ ] Responsive on mobile

### Test Accounts
```
Teacher:
Email: teacher@test.com
Password: test123456

Student:
Email: student@test.com
Password: test123456

Parent:
Email: parent@test.com
Password: test123456
```

## Performance Tips

### Optimize Build
- Use production build: `npm run build`
- Check bundle size: `npm run build --analyze`
- Lazy load components

### Optimize Runtime
- Use React DevTools Profiler
- Check Network tab for large responses
- Monitor memory usage

## Useful Tools

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Firebase
- Thunder Client or REST Client
- TypeScript Vue Plugin
- Prettier - Code formatter

### Browser Extensions
- React DevTools
- Redux DevTools
- Firebase Console extension
- Lighthouse

## Troubleshooting

### Issue: Port 3000 already in use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 PID

# Or use different port
npm run dev -- -p 3001
```

### Issue: Module not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Firebase connection error
- Verify `.env.local` has correct credentials
- Check Firebase Console for project
- Ensure Firebase project is active

### Issue: OpenAI API errors
- Verify API key in `.env.local`
- Check API balance and limits
- Verify request format

## Git Workflow

### Before submitting PR
```bash
# Update main branch
git checkout main
git pull

# Rebase feature branch
git checkout feature/my-feature
git rebase main

# Squash commits if needed
git rebase -i HEAD~3

# Push to remote
git push origin feature/my-feature --force-with-lease
```

## Code Style Guide

### Component Naming
```typescript
// Use PascalCase for components
export const DiagramRenderer: React.FC = () => {};

// Use camelCase for hooks and functions
const useDiagrams = () => {};
const handleClick = () => {};
```

### File Structure
```
ComponentName/
├── ComponentName.tsx     # Main component
├── ComponentName.test.tsx # Tests
└── index.ts             # Export
```

### Import Order
```typescript
// 1. External imports
import React from 'react';
import { Component } from 'external-lib';

// 2. Absolute imports
import { useAuth } from '@/hooks/useAuth';

// 3. Relative imports
import { Button } from './Button';
```

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [OpenAI Docs](https://openai.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

### Community
- GitHub Issues
- Stack Overflow
- Discord communities
- Reddit communities

## Need Help?

- Check README.md
- Search GitHub Issues
- Ask in Discussions
- Contact support: support@learnviz.com

---

Happy coding! 🚀
