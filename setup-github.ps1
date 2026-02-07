# GitHub Setup Script for Windows PowerShell
# Run this in PowerShell (not bash)

Write-Host "🚀 AI Kowcheg IDE - GitHub Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if gh is installed
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

if (-not $ghInstalled) {
    Write-Host "📦 Installing GitHub CLI..." -ForegroundColor Yellow
    winget install GitHub.cli

    Write-Host ""
    Write-Host "⚠️  Please restart your terminal and run this script again!" -ForegroundColor Yellow
    Write-Host "   After restart, run: .\setup-github.ps1" -ForegroundColor Yellow
    exit
}

Write-Host "✅ GitHub CLI found!" -ForegroundColor Green
Write-Host ""

# Check if authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Authenticating with GitHub..." -ForegroundColor Yellow
    gh auth login
}

Write-Host ""
Write-Host "📤 Creating GitHub repository..." -ForegroundColor Yellow
gh repo create ai-kowcheg-ide --public --source=. --remote=origin --push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create repository. It may already exist." -ForegroundColor Red
    Write-Host "   Run manually: gh repo create ai-kowcheg-ide --public" -ForegroundColor Yellow
    exit
}

# Get username
$username = gh api user --jq .login
Write-Host ""
Write-Host "👤 GitHub Username: $username" -ForegroundColor Green

# Update README
Write-Host "📝 Updating README with your username..." -ForegroundColor Yellow
$readmePath = "README.md"
$content = Get-Content $readmePath -Raw
$content = $content -replace 'YOUR-USERNAME', $username
Set-Content $readmePath $content

# Commit and push
git add README.md
git commit -m "Update StackBlitz button with GitHub username"
git push

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Your project is now available at:" -ForegroundColor Cyan
Write-Host "   GitHub: https://github.com/$username/ai-kowcheg-ide" -ForegroundColor White
Write-Host "   StackBlitz: https://stackblitz.com/github/$username/ai-kowcheg-ide" -ForegroundColor White
Write-Host ""
Write-Host "🎉 You can now share the StackBlitz link with others!" -ForegroundColor Green
