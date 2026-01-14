# Setup script for pushing wurk2do to GitHub (PowerShell)
# Replace YOUR_GITHUB_USERNAME with your actual GitHub username

Write-Host "🚀 Setting up wurk2do GitHub repository..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create the repository on GitHub:" -ForegroundColor White
Write-Host "   Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host "   Repository name: wurk2do" -ForegroundColor White
Write-Host "   Visibility: Public or Private" -ForegroundColor White
Write-Host "   DON'T initialize with README" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Then run these commands (replace YOUR_GITHUB_USERNAME):" -ForegroundColor White
Write-Host ""
Write-Host "   git add ." -ForegroundColor Green
Write-Host '   git commit -m "Initial commit: Week2Do - Privacy-focused weekly planner"' -ForegroundColor Green
Write-Host "   git branch -M main" -ForegroundColor Green
Write-Host "   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/wurk2do.git" -ForegroundColor Green
Write-Host "   git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Your project will be on GitHub!" -ForegroundColor Magenta
