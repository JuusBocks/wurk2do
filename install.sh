#!/bin/bash

# Week2Do Installation Script
# This script helps set up the Week2Do application

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║            Week2Do - Installation Script                       ║"
echo "║        Privacy-Focused Weekly Planner Setup                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is too old (found v$NODE_VERSION)"
    echo "Please upgrade to Node.js 18 or higher"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take a few minutes..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created"
        echo ""
        echo "⚠️  IMPORTANT: Edit .env file and add your Google credentials!"
        echo ""
        echo "You need to:"
        echo "1. Go to https://console.cloud.google.com/"
        echo "2. Create a new project"
        echo "3. Enable Google Drive API"
        echo "4. Create API Key and OAuth 2.0 Client ID"
        echo "5. Add credentials to .env file"
        echo ""
        echo "See SETUP_GUIDE.md for detailed instructions"
    else
        echo "⚠️  .env.example not found, creating basic .env..."
        cat > .env << 'EOF'
# Google Drive API Configuration
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_api_key_here
EOF
        echo "✅ Basic .env file created"
        echo "⚠️  Please edit .env and add your Google credentials"
    fi
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  Installation Complete! 🎉                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Configure Google Drive API (if not done yet):"
echo "   See: SETUP_GUIDE.md"
echo ""
echo "2. Edit .env file with your credentials:"
echo "   nano .env  (or use your favorite editor)"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "📖 Documentation:"
echo "   - Quick Start: QUICK_START.md"
echo "   - Full Setup: SETUP_GUIDE.md"
echo "   - Architecture: ARCHITECTURE.md"
echo ""
echo "🐳 For Docker deployment:"
echo "   docker-compose up -d"
echo ""
echo "Happy planning! 📅✨"
echo ""

