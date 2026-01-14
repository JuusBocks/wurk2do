# Week2Do Installation Script for Windows PowerShell
# This script helps set up the Week2Do application

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║            Week2Do - Installation Script                       ║" -ForegroundColor Cyan
Write-Host "║        Privacy-Focused Weekly Planner Setup                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Node version
$versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($versionNumber -lt 18) {
    Write-Host "⚠️  Node.js version is too old (found $nodeVersion)" -ForegroundColor Yellow
    Write-Host "Please upgrade to Node.js 18 or higher" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check for npm
try {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
} else {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Cyan
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Edit .env file and add your Google credentials!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "You need to:" -ForegroundColor White
        Write-Host "1. Go to https://console.cloud.google.com/" -ForegroundColor White
        Write-Host "2. Create a new project" -ForegroundColor White
        Write-Host "3. Enable Google Drive API" -ForegroundColor White
        Write-Host "4. Create API Key and OAuth 2.0 Client ID" -ForegroundColor White
        Write-Host "5. Add credentials to .env file" -ForegroundColor White
        Write-Host ""
        Write-Host "See SETUP_GUIDE.md for detailed instructions" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  .env.example not found, creating basic .env..." -ForegroundColor Yellow
        @"
# Google Drive API Configuration
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_api_key_here
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ Basic .env file created" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env and add your Google credentials" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  Installation Complete! 🎉                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure Google Drive API (if not done yet):" -ForegroundColor White
Write-Host "   See: SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Edit .env file with your credentials:" -ForegroundColor White
Write-Host "   notepad .env" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "4. Open your browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Yellow
Write-Host "   - Quick Start: QUICK_START.md" -ForegroundColor White
Write-Host "   - Full Setup: SETUP_GUIDE.md" -ForegroundColor White
Write-Host "   - Architecture: ARCHITECTURE.md" -ForegroundColor White
Write-Host ""
Write-Host "🐳 For Docker deployment:" -ForegroundColor Yellow
Write-Host "   docker-compose up -d" -ForegroundColor Green
Write-Host ""
Write-Host "Happy planning! 📅✨" -ForegroundColor Magenta
Write-Host ""

