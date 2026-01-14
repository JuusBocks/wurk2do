#!/bin/bash

# Setup script for pushing wurk2do to GitHub
# Replace YOUR_GITHUB_USERNAME with your actual GitHub username

echo "🚀 Setting up wurk2do GitHub repository..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Create .gitignore if not exists (should already exist)
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules
package-lock.json

# Build output
dist
dist-ssr

# Environment
.env
.env.local
.env.production

# Logs
*.log
logs

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/*
!.vscode/extensions.json
.idea
*.swp
*.swo

# Vercel
.vercel
EOF
fi

echo ""
echo "📋 Next steps:"
echo ""
echo "1. Create the repository on GitHub:"
echo "   Go to: https://github.com/new"
echo "   Repository name: wurk2do"
echo "   Visibility: Public or Private"
echo "   DON'T initialize with README"
echo ""
echo "2. Then run these commands (replace YOUR_GITHUB_USERNAME):"
echo ""
echo "   git add ."
echo "   git commit -m \"Initial commit: Week2Do - Privacy-focused weekly planner\""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/wurk2do.git"
echo "   git push -u origin main"
echo ""
echo "🎉 Your project will be on GitHub!"
