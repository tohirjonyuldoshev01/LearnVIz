# LearnViz - AI-Powered Visual Learning Platform

A comprehensive web-based platform that helps students master complex topics through interactive diagrams with AI-generated content.

## 🎯 Features

### Core Features
- **10+ Interactive Diagrams**: SWOT, Mind Maps, Flowcharts, Timelines, Pyramids, Venn Diagrams, and more
- **AI-Powered Content Generation**: Automatic content creation using OpenAI GPT
- **Multi-Role Authentication**: Separate dashboards for Students, Teachers, and Parents
- **Save & Export**: Save diagrams and export as PNG, PDF, or JSON
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Editing**: Edit generated content on the fly

### Diagram Types
1. **SWOT Diagram** - Analyze Strengths, Weaknesses, Opportunities, Threats
2. **Fishbone Diagram** - Cause and Effect Analysis
3. **Venn Diagram** - Compare similarities and differences
4. **Mind Map** - Hierarchical idea organization
5. **Flowchart** - Process and workflow visualization
6. **Timeline** - Historical events and chronological sequences
7. **Pyramid Diagram** - Hierarchical levels and priorities
8. **Cause-Effect Matrix** - Relationship mapping
9. **Concept Map** - Knowledge and relationship mapping
10. **T-Chart** - Compare two sides of a topic

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- OpenAI API key

### Installation

1. **Clone and Setup**
```bash
cd app
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env.local
```

Then edit `.env.local`:
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI
OPENAI_API_KEY=your_openai_key

# App
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

3. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📋 Architecture

```
app/
├── src/
│   ├── app/                    # Next.js App Directory
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth pages (login, register)
│   │   ├── dashboard/         # User dashboard
│   │   ├── diagram/           # Diagram pages (create, view, edit)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── diagrams/          # Diagram components (10 types)
│   │   ├── ui/                # Reusable UI components
│   │   └── layout/            # Layout components (Header, Footer)
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Auth hook
│   │   ├── useDiagrams.ts     # Diagrams hook
│   │   ├── useAIGenerator.ts  # AI generation hook
│   │   └── useExport.ts       # Export hook
│   ├── lib/                   # Utilities and config
│   │   ├── firebase/          # Firebase setup
│   │   ├── axios.ts           # API client
│   │   └── constants.ts       # Constants
│   ├── services/              # API service layer
│   │   ├── authService.ts     # Auth operations
│   │   ├── diagramService.ts  # Diagram CRUD
│   │   └── aiService.ts       # AI operations
│   ├── store/                 # Zustand stores
│   │   ├── authStore.ts       # Auth state
│   │   └── diagramStore.ts    # Diagram state
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Helper functions
│   └── styles/                # Global styles
├── public/                    # Static files
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔧 Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: OpenAI API (GPT-3.5/GPT-4)
- **State Management**: Zustand
- **Export**: html2canvas, jsPDF
- **UI Components**: Custom components + Tailwind CSS

## 📱 User Flows

### Student Flow
1. Register/Login
2. Navigate to Dashboard
3. Create New Diagram
4. Select diagram type (10 options)
5. Enter topic and education level
6. AI generates content
7. Edit if needed
8. Save to Firebase
9. View saved diagrams
10. Export as PNG/PDF

### Teacher Flow
1. Same as student + can track student progress
2. View all student diagrams
3. Provide feedback
4. Monitor learning patterns

### Parent Flow
1. View child's dashboard (with permissions)
2. Monitor learning activity
3. Access performance metrics

## 🔐 Firebase Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Set Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /diagrams/{diagramId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.createdBy;
      allow create: if request.auth != null;
    }
  }
}
```

## 🤖 OpenAI Integration

### Get API Key
1. Create account at [OpenAI Platform](https://platform.openai.com)
2. Generate API key
3. Add to `.env.local`

### Models Used
- `gpt-3.5-turbo` (default, cost-effective)
- `gpt-4` (optional, more accurate)

## 📦 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push origin main
```

2. **Deploy on Vercel**
   - Go to [Vercel.com](https://vercel.com)
   - Import project
   - Add environment variables
   - Deploy

### Deploy to Other Platforms

**Netlify:**
```bash
npm run build
# Deploy the .next folder
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 API Reference

### Generate Diagram Content
**POST** `/api/diagrams/generate`

Request:
```json
{
  "topic": "Artificial Intelligence in Education",
  "diagramType": "swot",
  "educationLevel": "high",
  "language": "English"
}
```

Response:
```json
{
  "success": true,
  "content": {
    "strengths": "...",
    "weaknesses": "...",
    "opportunities": "...",
    "threats": "..."
  }
}
```

### Health Check
**GET** `/api/health`

## 🎓 Usage Examples

### Create a SWOT Diagram
1. Login as student
2. Go to Dashboard → Create New Diagram
3. Select "SWOT Analysis"
4. Enter topic: "Remote Learning"
5. Select education level: "College"
6. Click "Generate Content with AI"
7. Wait for AI to generate content
8. Edit if needed
9. Click "Save Diagram"

### Export Diagram
1. Open any diagram
2. Click "Export as PNG" or "Export as PDF"
3. File downloads to device

## 🔍 Key Components

### SwotDiagram Component
```typescript
<SwotDiagram
  content={{ strengths: "...", weaknesses: "...", ... }}
  isEditable={true}
  onContentChange={(content) => console.log(content)}
/>
```

### DiagramRenderer Component
```typescript
<DiagramRenderer
  type="swot"
  content={content}
  isEditable={false}
/>
```

## 🛠️ Development

### Add New Diagram Type

1. Create component in `src/components/diagrams/NewDiagram.tsx`
2. Add prompt to `DIAGRAM_PROMPTS` in API route
3. Add template to `DIAGRAM_TEMPLATES` in constants
4. Export from `src/components/diagrams/index.ts`
5. Update `DiagramRenderer` switch statement

### Customize Styling

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6', // Change primary color
      secondary: '#1E40AF',
    },
  },
},
```

## 🐛 Troubleshooting

### AI Content Not Generating
- Check OPENAI_API_KEY in `.env.local`
- Verify API key has sufficient credits
- Check API rate limits

### Firebase Connection Issues
- Verify Firebase config in `.env.local`
- Check Firestore Rules
- Ensure database exists

### Authentication Failing
- Clear browser cache
- Check Firebase Auth setup
- Verify email/password is correct

## 📊 Performance Optimization

- Lazy load diagrams
- Cache AI responses
- Optimize bundle size
- Use NextImage for images
- Implement pagination for diagram lists

## 🔐 Security Best Practices

- Validate all user inputs
- Implement rate limiting
- Use HTTPS only
- Store sensitive data in environment variables
- Implement CORS properly
- Validate Firebase tokens server-side

## 📄 License

MIT License - feel free to use this project for educational purposes

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.

## 📞 Support

- Email: support@learnviz.com
- Documentation: https://learnviz.com/docs
- GitHub Issues: Report bugs and request features

## 🎯 Future Improvements

- [ ] Collaborative editing
- [ ] Real-time multiplayer diagrams
- [ ] Advanced analytics dashboard
- [ ] Mobile native apps
- [ ] Offline support
- [ ] More diagram types
- [ ] Video tutorials
- [ ] Interactive quizzes
- [ ] AI-powered feedback system
- [ ] Integration with learning management systems

---

**Built with ❤️ for visual learners everywhere**
