# Auto-push script - Will keep trying until repository exists
Write-Host "🚀 Auto-push script started!" -ForegroundColor Cyan
Write-Host "Waiting for repository to be created...`n" -ForegroundColor Yellow

$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host "Attempt $attempt/$maxAttempts - Checking repository..." -ForegroundColor Gray
    
    $result = git push -u origin main 2>&1 | Out-String
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
        Write-Host "Repository URL: https://github.com/Soyeb78692/whatsapp-reuse-extension" -ForegroundColor Cyan
        break
    }
    
    if ($result -match "Repository not found") {
        Write-Host "Repository not created yet. Waiting 3 seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    } else {
        Write-Host "`n⚠️  Error: $result" -ForegroundColor Red
        break
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Host "`n⏱️  Timeout reached. Please create the repository manually:" -ForegroundColor Yellow
    Write-Host "https://github.com/new?name=whatsapp-reuse-extension&public=true" -ForegroundColor Cyan
    Write-Host "`nThen run: git push -u origin main" -ForegroundColor Yellow
}
