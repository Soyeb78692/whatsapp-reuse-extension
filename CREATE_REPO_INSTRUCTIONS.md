# Quick Repository Creation Guide

I've prepared everything! Here are **3 easy ways** to create your GitHub repository:

## Option 1: Use the PowerShell Script (Easiest!)

1. **Get a GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "Repo Creator"
   - Select scope: ✅ **repo** (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Run the script:**
   ```powershell
   .\create-repo.ps1 -Token "YOUR_TOKEN_HERE"
   ```

   Replace `YOUR_TOKEN_HERE` with your actual token.

This will create the repository AND push your code automatically!

---

## Option 2: Direct GitHub Link (Fast!)

Click this link to create the repository with pre-filled details:
**https://github.com/new?name=whatsapp-reuse-extension&description=Chrome+extension+to+reuse+WhatsApp+Web+tabs+and+open+chats+quickly&public=true**

Then after creating it, just run:
```powershell
git push -u origin main
```

---

## Option 3: Manual Steps

1. Go to: https://github.com/new
2. Repository name: `whatsapp-reuse-extension`
3. Description: `Chrome extension to reuse WhatsApp Web tabs and open chats quickly`
4. Select: **Public**
5. **DO NOT** check "Add a README file"
6. Click "Create repository"
7. Then run: `git push -u origin main`

---

**Which option do you prefer?** Option 1 is the fastest if you have a token ready!
