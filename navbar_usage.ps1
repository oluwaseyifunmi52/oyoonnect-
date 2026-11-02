& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        $files = @("src/layouts/PublicLayout.tsx", "src/layouts/CommunityLayout.tsx", "src/layouts/HelpLayout.tsx")
        foreach ($f in $files) {
            Write-Output "=== $f ==="
            $content = Get-Content $f
            # Find lines with Navbar
            $navbarLines = $content | Where-Object { $_ -match "Navbar" }
            $navbarLines | ForEach-Object { Write-Output "  $_" }
            Write-Output ""
        }
    } finally {
        Pop-Location
    }
}