# GitHub Repository Setup Guide

Your extension is ready to be pushed to GitHub! Follow these steps:

## Step 1: Configure Git (if not already done)

First, set your Git identity (replace with your actual name and email):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Or set it only for this repository:

```bash
cd "C:\Users\Soyeb PC\Downloads\whatsapp-reuse-extension"
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 2: Create Initial Commit

After configuring Git, create your first commit:

```bash
cd "C:\Users\Soyeb PC\Downloads\whatsapp-reuse-extension"
git add .
git commit -m "Initial commit: WhatsApp Reuse Tab Extension"
```

## Step 3: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `whatsapp-reuse-extension` (or your preferred name)
   - **Description**: "Chrome extension to reuse WhatsApp Web tabs and open chats quickly"
   - **Visibility**: Select **"Public"** (or Private if you prefer)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 4: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these commands:

```bash
cd "C:\Users\Soyeb PC\Downloads\whatsapp-reuse-extension"

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-reuse-extension.git

# Rename the default branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
cd "C:\Users\Soyeb PC\Downloads\whatsapp-reuse-extension"
gh repo create whatsapp-reuse-extension --public --source=. --remote=origin --push
```

## Step 5: Verify

1. Go to your GitHub repository page
2. You should see all your files:
   - `manifest.json`
   - `popup.html`
   - `popup.js`
   - `README.md`
   - `.gitignore`

## Next Steps

- Update the README.md with your GitHub username in the clone URL
- Add topics/tags to your repository (e.g., `chrome-extension`, `whatsapp`, `javascript`)
- Consider adding a LICENSE file if you want to specify how others can use your code

## Troubleshooting

### If you get authentication errors:
- Use a Personal Access Token instead of password
- Or use GitHub Desktop app for easier authentication

### If you need to update the remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/whatsapp-reuse-extension.git
```

### To check your current remote:
```bash
git remote -v
```

---

**Note**: Make sure to replace `YOUR_USERNAME` with your actual GitHub username in all commands above.
