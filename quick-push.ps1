# Quick script to create repo and push (requires GITHUB_TOKEN env var or parameter)

param(
    [string]$Token = $env:GITHUB_TOKEN
)

$repoName = "whatsapp-reuse-extension"
$description = "Chrome extension to reuse WhatsApp Web tabs and open chats quickly"
$username = "Soyeb78692"

Write-Host "🚀 Creating repository and pushing code..." -ForegroundColor Cyan

# Try to push first (in case repo exists)
Write-Host "`nChecking if repository exists..." -ForegroundColor Yellow
$pushOutput = git push -u origin main 2>&1 | Out-String

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code pushed successfully!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/$username/$repoName" -ForegroundColor Cyan
    exit 0
}

# Repository doesn't exist, create it
if ($pushOutput -match "remote.*not found" -or $pushOutput -match "repository not found" -or $pushOutput -match "could not read") {
    Write-Host "`nRepository not found. Creating it..." -ForegroundColor Yellow
    
    if ([string]::IsNullOrWhiteSpace($Token)) {
        Write-Host "`n❌ GitHub token required!" -ForegroundColor Red
        Write-Host "`nOption 1: Set environment variable:" -ForegroundColor Yellow
        Write-Host '  $env:GITHUB_TOKEN = "your-token-here"' -ForegroundColor Cyan
        Write-Host "  .\quick-push.ps1" -ForegroundColor Cyan
        Write-Host "`nOption 2: Pass as parameter:" -ForegroundColor Yellow
        Write-Host '  .\quick-push.ps1 -Token "your-token-here"' -ForegroundColor Cyan
        Write-Host "`nGet token: https://github.com/settings/tokens/new (select 'repo' scope)" -ForegroundColor Yellow
        exit 1
    }
    
    $body = @{
        name = $repoName
        description = $description
        private = $false
    } | ConvertTo-Json
    
    $headers = @{
        Authorization = "Bearer $Token"
        Accept = "application/vnd.github.v3+json"
        "User-Agent" = "PowerShell"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "✅ Repository created!" -ForegroundColor Green
        
        Write-Host "`nPushing code..." -ForegroundColor Yellow
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n🎉 SUCCESS! Repository is live!" -ForegroundColor Green
            Write-Host "URL: $($response.html_url)" -ForegroundColor Cyan
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "`n❌ Error: $statusCode" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        
        if ($statusCode -eq 422) {
            Write-Host "`nRepository might already exist. Trying to push..." -ForegroundColor Yellow
            git push -u origin main
        }
    }
} else {
    Write-Host "`nPush error:" -ForegroundColor Red
    Write-Host $pushOutput -ForegroundColor Red
}
