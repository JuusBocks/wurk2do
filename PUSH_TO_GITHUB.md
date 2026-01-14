# Push wurk2do to GitHub

## Quick Start

### 1. Create the Repository on GitHub

Go to: **https://github.com/new**

- **Repository name**: `wurk2do`
- **Description**: `Privacy-focused weekly planner with Google Drive sync`
- **Visibility**: Public (recommended) or Private
- **Important**: DON'T initialize with README, .gitignore, or license

Click **Create repository**

### 2. Push Your Code

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Week2Do - Privacy-focused weekly planner"

# Rename branch to main
git branch -M main

# Add remote origin (REPLACE YOUR_GITHUB_USERNAME!)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/wurk2do.git

# Push to GitHub
git push -u origin main
```

### 3. Verify

Visit: `https://github.com/YOUR_GITHUB_USERNAME/wurk2do`

You should see all your files! 🎉

## Using GitHub CLI (Alternative)

If you have GitHub CLI installed:

```bash
# Create repo and push in one command
gh repo create wurk2do --public --source=. --remote=origin --push
```

## Troubleshooting

### "Repository already exists"
Use a different name or delete the existing repo first.

### "Authentication failed"
Set up SSH keys or use a personal access token:
- SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Token: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

### "Remote origin already exists"
Remove it first: `git remote remove origin`
Then add again with the correct URL.

## Next Steps

After pushing:

1. **Add README badges** (optional)
2. **Enable GitHub Pages** (for demo)
3. **Set up GitHub Actions** (for CI/CD)
4. **Add repository topics**: `react`, `vite`, `tailwindcss`, `google-drive`, `privacy`
5. **Add a license** (MIT recommended)

## Connect Vercel to GitHub

If your Vercel deployment is not connected yet:

1. Go to Vercel Dashboard
2. Import the new GitHub repository
3. Vercel will auto-deploy on every push!

