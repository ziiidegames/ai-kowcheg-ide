# 🚀 Quick Start - Deploy to GitHub & StackBlitz

## ✅ What's Done

- [x] Git repository initialized
- [x] 3 commits created with all project files
- [x] StackBlitz badge added to README
- [x] Deployment documentation created

## 🎯 Next Steps - Choose Your Method

### 🔥 FASTEST: Automated Script (PowerShell)

**Open PowerShell** (not bash) and run:

```powershell
cd d:\kovcheg-project
.\setup-github.ps1
```

This will:
1. Install GitHub CLI (if needed)
2. Authenticate with GitHub
3. Create public repository
4. Push all code
5. Update README with your username
6. Show your StackBlitz link

### 🐙 Manual Method

See detailed instructions in [GITHUB_SETUP.md](GITHUB_SETUP.md)

Quick version:
```bash
# 1. Create repo at github.com/new
#    Name: ai-kowcheg-ide
#    Public, no initialization

# 2. Add remote and push
git remote add origin https://github.com/YOUR-USERNAME/ai-kowcheg-ide.git
git branch -M main
git push -u origin main

# 3. Update README.md
#    Replace YOUR-USERNAME with your GitHub username

# 4. Commit and push
git add README.md
git commit -m "Update StackBlitz button"
git push
```

## 📦 Project Files Ready for StackBlitz

Your project includes all necessary files:
- `.stackblitzrc` - StackBlitz environment config
- `sandbox.config.json` - Container settings (Node 18, Port 3000)
- `.env.example` - Environment variables template
- `README.md` - Complete documentation with StackBlitz badge
- `STACKBLITZ.md` - Deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist

## 🌐 After Deployment

Your StackBlitz link will be:
```
https://stackblitz.com/github/YOUR-USERNAME/ai-kowcheg-ide
```

### ⚠️ Important: Ollama API

StackBlitz runs in browser, so local Ollama won't work. Options:
1. **Demo mode**: Use mock data
2. **Cloud hosting**: Deploy Ollama to Railway/Render/Fly.io

Update environment variable:
```bash
NEXT_PUBLIC_OLLAMA_BASE_URL=https://your-ollama-instance.com
```

## 📊 Git Status

```
Current branch: master
Commits: 3
Files: 101
All changes committed ✅
```

## 🔧 Troubleshooting

### PowerShell script won't run
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### GitHub CLI not found after install
Restart your terminal or use full path:
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" --version
```

## 📚 Documentation

- [GITHUB_SETUP.md](GITHUB_SETUP.md) - Complete GitHub setup guide
- [STACKBLITZ.md](STACKBLITZ.md) - StackBlitz deployment details
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment checks
- [README.md](README.md) - Project documentation

## 🎉 What's Next?

1. Run setup script or push manually
2. Click StackBlitz badge in your GitHub repo
3. Share the link!
4. (Optional) Deploy to Vercel for production
5. (Optional) Host Ollama API separately

---

**Need help?** Check [GITHUB_SETUP.md](GITHUB_SETUP.md) for detailed instructions.
