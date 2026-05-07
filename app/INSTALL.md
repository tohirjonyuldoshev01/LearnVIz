# LearnViz - Complete Installation Guide

## System Requirements

- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher  
- **RAM**: 2GB minimum
- **Disk Space**: 500MB
- **Internet**: Required for API calls

## Installation Steps (15 minutes)

### Step 1: Setup Backend Services

#### Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name "LearnViz"
4. Accept default settings
5. Create project (wait 2-3 minutes)

#### Enable Firebase Authentication
1. In Firebase Console, click "Authentications"
2. Click "Get Started"
3. Select "Email/Password"
4. Toggle "Enable"
5. Click "Save"

#### Create Firestore Database
1. Click "Firestore Database"
2. Click "Create Database"
3. Select "Start in test mode"
4. Select region closest to you
5. Click "Enable"

#### Get Firebase Credentials
1. Click "Project Settings" (⚙️ icon)
2. Under "General" tab, find "Your apps" section
3. If no web app, click "Add app" → select web icon
4. Copy the config object
5. Save for next step

#### Setup Firestore Rules
1. In Firestore, click "Rules" tab
2. Replace all content with:
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

### Step 2: Setup OpenAI API

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create account
3. Click "API Keys" in left sidebar
4. Click "Create new secret key"
5. Copy the key (you won't see it again!)
6. Save securely

### Step 3: Clone and Setup Project

```bash
# Navigate to your workspace
cd "path/to/your/workspace"

# Clone project (if using git)
git clone <repository-url>
cd learnviz/app

# Or if downloaded as zip
cd learnviz/app

# Install dependencies
npm install
```

### Step 4: Configure Environment

```bash
# Copy example file
cp .env.example .env.local

# Open .env.local in your editor
# Find and fill in these values:
```

Edit `.env.local`:
```
# Paste Firebase Config Here
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...

# Paste OpenAI API Key
OPENAI_API_KEY=sk-...

# Local Development (keep as-is)
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Step 5: Start Development Server

```bash
npm run dev
```

Output should look like:
```
> learnviz@1.0.0 dev
> next dev

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.3s
```

### Step 6: Verify Installation

1. Open [http://localhost:3000](http://localhost:3000) in browser
2. You should see LearnViz homepage
3. Try registering a test account
4. Create a test diagram
5. Generate content with AI

## Troubleshooting Installation

### Issue: "Port 3000 already in use"
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: "Cannot find module 'firebase'"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Firebase initialization error"
```
Check .env.local:
- Verify all Firebase values are correct
- No extra spaces or quotes
- NEXT_PUBLIC_ prefix is included
```

### Issue: "OpenAI API error"
```
Check:
- API key is correct (starts with sk-)
- API has sufficient credits
- Check OpenAI usage dashboard
```

### Issue: "Can't create diagram - Firebase error"
```
Check:
- Firestore Database exists
- Security rules are published
- You're logged in
- Check browser console for error
```

## First Time Usage

### Create Your First Diagram

1. **Go to Homepage**
   - Visit http://localhost:3000
   
2. **Register Account**
   - Click "Get Started Free"
   - Fill in email, password, name, role
   - Click "Create Account"

3. **Login**
   - You're automatically logged in
   - Redirected to dashboard

4. **Create Diagram**
   - Click "Create New Diagram"
   - Select "SWOT Analysis"
   - Enter title: "Climate Change"
   - Enter topic: "Climate Change"
   - Select level: "High"
   - Click "Generate Content with AI"
   - Wait 5-10 seconds
   - Content appears!

5. **Save Diagram**
   - Review generated content
   - Click "Save Diagram"
   - Returns to dashboard

6. **Export Diagram**
   - Click diagram to view
   - Click "Export as PNG"
   - Image downloads to computer

## Project Commands

```bash
# Development
npm run dev                    # Start dev server

# Building
npm run build                  # Build for production
npm start                      # Start production server

# Code Quality
npm run lint                   # Check code quality
npm run format                 # Format code with Prettier
npm run type-check             # TypeScript checking

# Clean Up
rm -rf node_modules            # Remove dependencies
npm install                    # Reinstall dependencies
```

## File Organization

After installation, your project looks like:
```
learnviz/app/
├── src/                       # Source code
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   ├── services/             # Business logic
│   ├── hooks/                # Custom hooks
│   ├── types/                # TypeScript types
│   └── utils/                # Helper functions
├── public/                   # Static files
├── package.json             # Dependencies
├── .env.local               # Your environment variables
└── README.md                # Documentation
```

## Next Steps After Installation

1. **Understand the Architecture**
   - Read [README.md](./README.md)

2. **Learn the Setup**
   - Read [SETUP.md](./SETUP.md)

3. **Try All Features**
   - Create different diagram types
   - Test export functionality
   - Edit diagrams

4. **Ready for Production?**
   - Read [DEPLOYMENT.md](./DEPLOYMENT.md)

## Useful Resources

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Firebase**: https://firebase.google.com/docs
- **OpenAI**: https://openai.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## Getting Help

### Common Problems

**Problem: No diagrams saved**
- Check if you're logged in
- Verify Firestore database exists
- Check browser console for errors

**Problem: AI not generating content**
- Verify OPENAI_API_KEY in .env.local
- Check API has available credits
- Try a simpler topic

**Problem: Styling looks broken**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Reinstall Tailwind: `npm install`

### Where to Find Help

1. **Check Documentation**
   - README.md
   - SETUP.md
   - FEATURES.md

2. **Check Browser Console**
   - Right-click → Inspect
   - Click "Console" tab
   - Look for error messages

3. **Check Terminal Output**
   - Look at terminal running `npm run dev`
   - Copy error message
   - Google the error

## Security Reminders

⚠️ **IMPORTANT:**
- Never commit `.env.local` to git
- Never share `OPENAI_API_KEY`
- Never share Firebase credentials
- Keep `.env.local` secure locally

## Performance Tips

- First load may take 10 seconds (normal)
- Content generation takes 5-10 seconds (normal)
- Clear browser cache if things look broken
- Use same browser for testing

## You're Ready! 🎉

Your LearnViz installation is complete. Start creating diagrams!

```
http://localhost:3000
```

---

**Need help?** Check the documentation files or contact support.
