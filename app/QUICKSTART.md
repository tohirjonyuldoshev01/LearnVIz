# Quick Start Guide for LearnViz

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd app
npm install
```

### Step 2: Configure Environment
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your:
# - Firebase credentials
# - OpenAI API key
```

### Step 3: Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 What You Need

### Firebase Account
1. Go to [firebase.google.com](https://firebase.google.com)
2. Create a new project
3. Enable Email/Password authentication
4. Create a Firestore Database
5. Copy your config

### OpenAI API Key
1. Go to [openai.com](https://openai.com)
2. Create an API key
3. Add it to `.env.local`

## 🎯 Try These Features

### 1. Create Account
- Visit http://localhost:3000
- Click "Sign Up"
- Choose your role (Student/Teacher/Parent)
- Complete registration

### 2. Create a Diagram
- Go to Dashboard
- Click "Create New Diagram"
- Select a diagram type (e.g., SWOT)
- Enter a topic (e.g., "Climate Change")
- Click "Generate Content with AI"
- AI fills the diagram automatically!

### 3. Save & Export
- Click "Save Diagram"
- Diagram is saved to your account
- Click "Export as PNG" or "Export as PDF"

## 📁 Project Structure

```
app/
├── src/
│   ├── app/              # Pages & API routes
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── services/        # API calls
│   └── styles/          # CSS
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🔧 Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Format code
npm run format

# Linting
npm run lint
```

## 🐛 Troubleshooting

### Port 3000 in use?
```bash
npm run dev -- -p 3001
```

### Module not found?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase errors?
- Check `.env.local` has correct credentials
- Verify Firebase project exists
- Check Firestore Rules allow access

### AI not generating?
- Verify OPENAI_API_KEY in `.env.local`
- Check API has available credits
- Look at browser console for errors

## 📚 Next Steps

1. Read [SETUP.md](./SETUP.md) for detailed setup
2. Read [README.md](./README.md) for complete documentation
3. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## 🎓 Learn More

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Firebase**: https://firebase.google.com/docs
- **OpenAI**: https://openai.com/docs
- **Tailwind**: https://tailwindcss.com

## 💡 Tips

- Use VS Code for best development experience
- Install React DevTools browser extension
- Check browser console for debugging
- Use Firestore Console to inspect data

## ✅ Verification Checklist

After running `npm run dev`:
- [ ] App loads at http://localhost:3000
- [ ] Homepage displays with welcome message
- [ ] Can navigate to login/signup
- [ ] No errors in browser console
- [ ] No errors in terminal

## 📞 Need Help?

- Check README.md FAQ section
- Search GitHub issues
- Check error logs
- Contact: support@learnviz.com

---

✨ **You're all set! Start learning with LearnViz!**
