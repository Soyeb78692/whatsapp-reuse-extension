# Automated script to create GitHub repo and push code
# This will prompt for your GitHub token if needed

$repoName = "whatsapp-reuse-extension"
$description = "Chrome extension to reuse WhatsApp Web tabs and open chats quickly"
$username = "Soyeb78692"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host "🚀 Setting up GitHub repository..." -ForegroundColor Cyan
Write-Host "Repository: $repoName" -ForegroundColor Yellow
Write-Host "Username: $username`n" -ForegroundColor Yellow

# First, try to push (in case repo already exists)
Write-Host "Attempting to push code..." -ForegroundColor Cyan
$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Success! Code pushed to existing repository!" -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/$username/$repoName" -ForegroundColor Cyan
    exit 0
}

# If push failed, check if it's because repo doesn't exist
if ($pushResult -match "remote.*not found" -or $pushResult -match "repository not found") {
    Write-Host "`n⚠️  Repository doesn't exist yet. Creating it now..." -ForegroundColor Yellow
    Write-Host "`nTo create the repository, you need a GitHub Personal Access Token." -ForegroundColor Yellow
    Write-Host "Get one here: https://github.com/settings/tokens/new" -ForegroundColor Cyan
    Write-Host "Select scope: ✅ repo (full control)" -ForegroundColor Yellow
    Write-Host ""
    
    $token = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
    $plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    
    if ([string]::IsNullOrWhiteSpace($plainToken)) {
        Write-Host "❌ Token is required. Exiting." -ForegroundColor Red
        exit 1
    }
    
    $body = @{
        name = $repoName
        description = $description
        private = $false
    } | ConvertTo-Json
    
    $headers = @{
        Authorization = "token $plainToken"
        Accept = "application/vnd.github.v3+json"
    }
    
    try {
        Write-Host "`nCreating repository on GitHub..." -ForegroundColor Cyan
        $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
        
        Write-Host "✅ Repository created successfully!" -ForegroundColor Green
        Write-Host "Repository URL: $($response.html_url)" -ForegroundColor Cyan
        
        Write-Host "`nPushing your code..." -ForegroundColor Yellow
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n🎉 SUCCESS! Your repository is live!" -ForegroundColor Green
            Write-Host "View it at: $($response.html_url)" -ForegroundColor Cyan
        } else {
            Write-Host "`n⚠️  Repository created but push failed. Try running: git push -u origin main" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "`n❌ Error creating repository:" -ForegroundColor Red
        $errorMsg = $_.Exception.Message
        Write-Host $errorMsg -ForegroundColor Red
        
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "`nAuthentication failed. Please check your token." -ForegroundColor Yellow
        } elseif ($_.Exception.Response.StatusCode -eq 422) {
            Write-Host "`nRepository might already exist. Trying to push..." -ForegroundColor Yellow
            git push -u origin main
        }
    }
} else {
    Write-Host "`n❌ Push failed with error:" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Red
    Write-Host "`nPlease check your git configuration and try again." -ForegroundColor Yellow
}
