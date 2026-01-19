# PowerShell script to create GitHub repository via API
# You need a GitHub Personal Access Token with 'repo' scope

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$repoName = "whatsapp-reuse-extension"
$description = "Chrome extension to reuse WhatsApp Web tabs and open chats quickly"
$username = "Soyeb78692"

$body = @{
    name = $repoName
    description = $description
    private = $false
} | ConvertTo-Json

$headers = @{
    Authorization = "token $Token"
    Accept = "application/vnd.github.v3+json"
}

Write-Host "Creating repository: $repoName" -ForegroundColor Green
Write-Host "Description: $description" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "`n✅ Repository created successfully!" -ForegroundColor Green
    Write-Host "Repository URL: $($response.html_url)" -ForegroundColor Cyan
    
    Write-Host "`nNow pushing your code..." -ForegroundColor Yellow
    
    # Push the code
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 Success! Your repository is live at: $($response.html_url)" -ForegroundColor Green
    }
} catch {
    Write-Host "`n❌ Error creating repository:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "`nAuthentication failed. Please check your token." -ForegroundColor Yellow
    } elseif ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "`nRepository might already exist or name is invalid." -ForegroundColor Yellow
    }
}
