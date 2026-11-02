& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        (Get-Content "src\pages\HelpLandingPage.tsx") | Select-String "EmptyState" -Context 0,5
    } finally {
        Pop-Location
    }
}