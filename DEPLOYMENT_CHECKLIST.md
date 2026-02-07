# Deployment Checklist

## Pre-Deployment Checks

### ✅ Files Created
- [x] `.stackblitzrc` - StackBlitz configuration
- [x] `sandbox.config.json` - Container settings
- [x] `.env.example` - Environment variables template
- [x] `README.md` - Updated with project description
- [x] `STACKBLITZ.md` - Deployment guide

### ✅ Code Quality
- [x] All dependencies in `package.json`
- [x] API routes configured (app/api/ollama/route.ts)
- [x] Environment variables support
- [x] TypeScript compilation ready
- [x] ESLint configuration

### ✅ Functionality Verified
- [x] Visual Workflow Editor with React Flow
- [x] Ollama API integration
- [x] Model selection (Llama 3, Mistral, CodeLlama)
- [x] Frame creation and connections
- [x] Content generation
- [x] Dev Panel for live styling
- [x] Dark theme throughout

## Local Testing Before Deploy

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Build check
npm run build

# 3. Dev server
npm run dev

# 4. Test Ollama connection
curl http://localhost:11434/api/tags
```

## StackBlitz Deployment Steps

### Option 1: CLI (Recommended)

```bash
npx @stackblitz/sdk create-project ai-kowcheg \
  --template=node \
  --title="AI Kowcheg IDE" \
  --description="Visual AI Content Generation Platform"
```

### Option 2: GitHub Integration

1. Push project to GitHub
2. Visit [stackblitz.com/fork/github](https://stackblitz.com/fork/github)
3. Enter repository URL
4. Click "Fork"

### Option 3: Direct Upload

1. Create ZIP archive (exclude node_modules)
2. Visit [stackblitz.com](https://stackblitz.com)
3. Click "Upload Project"
4. Select ZIP file

## Post-Deployment Configuration

### For StackBlitz (Browser-only)

Since Ollama runs locally, you'll need to:

1. **Mock Mode** - Replace Ollama calls with mock data
2. **Cloud Ollama** - Deploy Ollama separately:
   - Railway: `railway.app`
   - Render: `render.com`
   - Fly.io: `fly.io`

Update environment variable:
```bash
NEXT_PUBLIC_OLLAMA_BASE_URL=https://your-ollama-instance.com
```

### For Full Production

Deploy frontend and backend separately:

**Frontend (Vercel):**
```bash
vercel --prod
```

**Backend (Railway):**
```bash
railway up
```

## Troubleshooting

### Build Fails
- Check Node version (18+)
- Clear cache: `rm -rf .next`
- Reinstall: `npm ci`

### API Not Working
- Verify Ollama is running: `ollama serve`
- Check models: `ollama list`
- Test endpoint: `curl http://localhost:11434/api/tags`

### StackBlitz Issues
- Check browser console for errors
- Verify all files uploaded correctly
- Check sandbox.config.json settings

## Support Resources

- [StackBlitz Docs](https://developer.stackblitz.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Ollama Docs](https://ollama.ai/docs)
- [Project README](./README.md)
