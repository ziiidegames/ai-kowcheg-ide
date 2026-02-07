# GitHub Setup Instructions

Git repository initialized! Follow these steps to push to GitHub and enable StackBlitz.

## Option 1: Using GitHub CLI (Recommended)

### Install GitHub CLI

```powershell
# Run in PowerShell (not bash)
winget install GitHub.cli
```

Restart your terminal, then:

```bash
# Authenticate
gh auth login

# Create repository and push
gh repo create ai-kowcheg-ide --public --source=. --remote=origin --push

# Get your GitHub username
gh api user --jq .login

# Update README with your username
# Replace YOUR-USERNAME in README.md with the output from above command

# Commit and push README update
git add README.md
git commit -m "Add StackBlitz button"
git push

# Get StackBlitz URL
echo "StackBlitz URL: https://stackblitz.com/github/$(gh api user --jq .login)/ai-kowcheg-ide"
```

## Option 2: Manual GitHub Setup

### Step 1: Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `ai-kowcheg-ide`
3. Description: "Visual AI Content Generation Platform"
4. Make it **Public**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Add Remote and Push

```bash
# Replace YOUR-USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR-USERNAME/ai-kowcheg-ide.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Update README

Edit [README.md](README.md) and replace:
```
YOUR-USERNAME
```

With your actual GitHub username. Then:

```bash
git add README.md
git commit -m "Add StackBlitz button"
git push
```

### Step 4: Access StackBlitz

Your project is now available at:
```
https://stackblitz.com/github/YOUR-USERNAME/ai-kowcheg-ide
```

## Verify Everything Works

1. Visit your GitHub repository: `https://github.com/YOUR-USERNAME/ai-kowcheg-ide`
2. Click the StackBlitz badge in README
3. StackBlitz should load your project

## Troubleshooting

### "gh: command not found" after installing
- Restart your terminal
- Or use full path: `C:\Program Files\GitHub CLI\gh.exe`

### Permission denied (publickey)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy output and add at: github.com/settings/ssh/new

# Or use HTTPS instead
git remote set-url origin https://github.com/YOUR-USERNAME/ai-kowcheg-ide.git
```

### Branch name mismatch
```bash
# GitHub uses 'main', local might be 'master'
git branch -M main
git push -u origin main
```

## Next Steps

After pushing to GitHub:
1. Share StackBlitz link with others
2. Deploy to Vercel for production: `vercel --prod`
3. Deploy Ollama API separately (Railway, Render, Fly.io)
4. Update `NEXT_PUBLIC_OLLAMA_BASE_URL` environment variable

## Support

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Git Documentation](https://git-scm.com/doc)
- [Project README](README.md)
