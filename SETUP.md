# 🚀 Quick Setup - Create Repo & Push Code

## Fastest Method (One Command!)

**Step 1:** Get a GitHub token (takes 30 seconds):
- Go to: https://github.com/settings/tokens/new
- Click "Generate new token (classic)"
- Name: "Repo Creator"
- Select: ✅ **repo** (full control)
- Click "Generate token"
- **Copy the token**

**Step 2:** Run this command (replace YOUR_TOKEN with your actual token):

```powershell
$env:GITHUB_TOKEN = "YOUR_TOKEN"; .\quick-push.ps1
```

That's it! The script will:
1. ✅ Create the repository on GitHub
2. ✅ Push all your code
3. ✅ Show you the repository URL

---

## Alternative: Manual Method

1. Create repo: https://github.com/new?name=whatsapp-reuse-extension&description=Chrome+extension+to+reuse+WhatsApp+Web+tabs+and+open+chats+quickly&public=true
2. Click "Create repository"
3. Run: `git push -u origin main`

---

**Need help?** The token is just for creating the repo. After that, you can use normal git commands!
