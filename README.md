# LuxeGen - AI-Powered Luxury UI Generator

Transform images and prompts into production-ready React components with luxury aesthetics.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- (Optional) Supabase account for authentication

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kashvi-techie/AI-Image-To-SaaS-Product-Generator.git
cd AI-Image-To-SaaS-Product-Generator
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables**

Create `backend/.env`:
```bash
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Server configuration
PORT=8080
```

Create `frontend/.env.local`:
```bash
# Backend URL - Express API server
BACKEND_URL=http://127.0.0.1:8080

# Optional: Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Get your API keys**

**Gemini API Key:**
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Add it to `backend/.env`

**Supabase (Optional):**
- Create a project at [Supabase](https://supabase.com)
- Get your project URL and anon key
- Add them to `frontend/.env.local`

### Running the Application

**Option 1: Run both backend and frontend (Recommended)**
```bash
# From the root directory
npm run dev
```

This starts:
- Backend on http://127.0.0.1:8080
- Frontend on http://localhost:3000

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Troubleshooting

### Backend Connection Issues

If you see "Next.js cannot reach your Express API":

1. **Check if backend is running:**
```bash
curl http://127.0.0.1:8080/health
```

2. **Verify BACKEND_URL in frontend/.env.local:**
```bash
BACKEND_URL=http://127.0.0.1:8080
```

3. **Restart both servers:**
```bash
# Stop both (Ctrl+C)
# Then from root:
npm run dev
```

### Supabase Authentication Issues

If you see middleware errors:

1. **Authentication is optional** - The app works without Supabase
2. **Leave Supabase vars empty** in `.env.local` to disable auth
3. **Clear Next.js cache:**
```bash
cd frontend
rm -rf .next
npm run dev
```

### Port Already in Use

If port 8080 or 3000 is already in use:

**Change backend port:**
```bash
# backend/.env
PORT=8081
```

**Update frontend to match:**
```bash
# frontend/.env.local
BACKEND_URL=http://127.0.0.1:8081
```

## 🏗️ Architecture

```
luxeGen/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── server.ts          # Main server
│   │   ├── gemini.ts          # Gemini AI integration
│   │   └── prompt-stream.ts   # Streaming responses
│   └── .env                   # Backend config
│
├── frontend/         # Next.js 15 application
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Login page
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities
│   └── .env.local             # Frontend config
│
└── package.json      # Root package.json
```

## 🔐 Security Features

- ✅ Rate limiting (100 req/15min general, 10 req/min for AI)
- ✅ Security headers (Helmet.js)
- ✅ CORS protection
- ✅ Input validation (Zod)
- ✅ Environment variable validation
- ✅ No exposed secrets

## 🎨 Features

- **Image to React**: Upload images and convert to React components
- **Prompt to UI**: Describe UI in natural language, get React code
- **Live Preview**: See changes in real-time
- **Design Styles**: Multiple luxury aesthetic presets
- **Responsive**: Mobile-first design
- **Dark Mode**: Full dark mode support
- **Authentication**: Optional Supabase auth (Google + Email)
- **Dashboard**: Track your generations and projects

## 📦 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **AI**: Google Gemini API
- **Auth**: Supabase (optional)
- **Animation**: Framer Motion
- **Validation**: Zod

## 🚢 Deployment

The AI runs **inside the Next.js app** (`frontend/app/api/*`), so the whole project
deploys as a **single Vercel app** — there is no separate backend to host, and
"Backend offline" can no longer happen.

### Deploy to Vercel

1. Connect your GitHub repository.
2. **Settings → General → Root Directory: `frontend`**
3. **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY` — **required** (https://aistudio.google.com/app/apikey)
   - `GEMINI_MODEL` — optional (defaults to `gemini-1.5-flash`)
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — optional (auth)
4. Deploy (or redeploy after adding the key).

> `BACKEND_URL` is **no longer required**. The `backend/` folder is kept for
> reference only and is not part of the deployment.

## 📝 Environment Variables

### Backend (.env)
```bash
GEMINI_API_KEY=          # Required: Google Gemini API key
PORT=8080                # Optional: Server port
NODE_ENV=development     # Optional: Environment
```

### Frontend (.env.local)
```bash
BACKEND_URL=http://127.0.0.1:8080  # Required: Backend URL

# Optional: Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/kashvi-techie/AI-Image-To-SaaS-Product-Generator/issues)
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Next.js team for the amazing framework
- Supabase for authentication infrastructure
- All contributors and supporters

---

**Built with ❤️ for the developer community**
