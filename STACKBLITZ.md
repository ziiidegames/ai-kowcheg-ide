# StackBlitz Deployment Guide

## Quick Start

### Option 1: NPX Command (Recommended)

```bash
npx @stackblitz/sdk create-project ai-kowcheg \
  --template=node \
  --title="AI Kowcheg IDE" \
  --description="Visual AI Content Generation Platform"
```

### Option 2: Web Interface

1. Visit [stackblitz.com/fork/github](https://stackblitz.com/fork/github)
2. Enter your GitHub repository URL
3. Click "Fork"

### Option 3: Manual Upload

1. Visit [stackblitz.com](https://stackblitz.com)
2. Click "New Project"
3. Select "Upload Project"
4. Upload your project folder

## Configuration Files

This project includes pre-configured StackBlitz files:

- `.stackblitzrc` - StackBlitz environment settings
- `sandbox.config.json` - Container configuration (Node 18, Port 3000)

## Important Notes

### Ollama Integration

StackBlitz runs in a browser sandbox, so **local Ollama API won't be accessible**. You have two options:

1. **Mock Mode** - Use mock responses for demo purposes
2. **Cloud Ollama** - Deploy Ollama to a cloud service (Railway, Render, etc.) and update API endpoint

To switch to cloud Ollama, update the API base URL in your environment or `lib/ollama.ts`:

```typescript
private baseUrl = process.env.NEXT_PUBLIC_OLLAMA_BASE_URL || '/api/ollama'
```

### Known Limitations

- File system operations are limited in StackBlitz
- Some Node.js modules may not work in browser environment
- Ollama API requires external hosting

## Recommended Cloud Hosting

For full functionality with Ollama API:

- **Vercel** - Frontend deployment (free tier available)
- **Railway** - Backend Ollama hosting
- **Render** - Alternative backend hosting
- **Fly.io** - Docker-based deployment

## Testing Locally First

Before deploying to StackBlitz:

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production
npm run build
```

## Support

For issues with StackBlitz deployment, check:
- [StackBlitz Documentation](https://developer.stackblitz.com/docs)
- [Project README](./README.md)
