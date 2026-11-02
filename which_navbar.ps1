& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        Get-ChildItem -Path "src/layouts" -Filter "*.tsx" -File | ForEach-Object {
            $content = Get-Content $_.FullName
            if ($content -match "Navbar") {
                Write-Output "$($_.Name): USES Navbar"
            } else {
                Write-Output "$($_.Name): NO Navbar"
            }
        }
    } finally {
        Pop-Location
    }
}