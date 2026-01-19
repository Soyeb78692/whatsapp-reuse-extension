# Fully automated repository creation and push script
# This will check authentication and create/push automatically

Write-Host "🚀 Automated GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

$repoName = "whatsapp-reuse-extension"
$description = "Chrome extension to reuse WhatsApp Web tabs and open chats quickly"

# Check if authenticated
Write-Host "Checking GitHub authentication..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n⚠️  Not authenticated. Starting authentication..." -ForegroundColor Yellow
    Write-Host "A browser window will open. Please complete the authentication.`n" -ForegroundColor Cyan
    gh auth login --web --hostname github.com
    Start-Sleep -Seconds 3
}

# Verify authentication
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Authentication failed. Please try again." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Authenticated!`n" -ForegroundColor Green

# Check if repo exists
Write-Host "Checking if repository exists..." -ForegroundColor Yellow
$repoCheck = gh repo view "Soyeb78692/$repoName" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Repository already exists!" -ForegroundColor Green
} else {
    Write-Host "Creating repository..." -ForegroundColor Yellow
    gh repo create $repoName --public --description $description --source=. --remote=origin --push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Repository created and code pushed!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Repository might already exist. Trying to push..." -ForegroundColor Yellow
        git push -u origin main
    }
}

# Final push to ensure everything is up to date
Write-Host "`nPushing latest code..." -ForegroundColor Yellow
git add .
git commit -m "Update: WhatsApp Reuse Tab Extension" 2>&1 | Out-Null
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 SUCCESS! Your repository is live!" -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/Soyeb78692/$repoName" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Push completed with warnings. Check the output above." -ForegroundColor Yellow
    Write-Host "Repository URL: https://github.com/Soyeb78692/$repoName" -ForegroundColor Cyan
}
