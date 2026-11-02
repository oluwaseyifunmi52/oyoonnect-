& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        Write-Output "=== NAVIGATION VERIFICATION ==="
        Write-Output ""
        
        # 1. siteConfig.nav items
        Write-Output "1. siteConfig.nav items:"
        $configContent = Get-Content "src/config/site.ts"
        if ($configContent -match "nav:\[(.*?)\].*as const") {
            $navSection = $matches[1]
            $items = $navSection -split "`n" | Where-Object { $_ -match "label" }
            $items | ForEach-Object { Write-Output "   $($_.Trim())" }
        }
        Write-Output ""
        
        # 2. MobileDrawer Wallet filter
        Write-Output "2. MobileDrawer Wallet filtering:"
        $mobileContent = Get-Content "src/components/navigation/MobileDrawer.tsx"
        if ($mobileContent -match "Wallet") {
            Write-Output "   Wallet IS mentioned in MobileDrawer"
        }
        if ($mobileContent -match "filter.*Wallet") {
            Write-Output "   Wallet is filtered out in mobile sections"
        }
        Write-Output ""
        
        # 3. Navbar used by layouts
        Write-Output "3. Layouts using Navbar:"
        $layouts = @("PublicLayout", "CommunityLayout", "HelpLayout")
        foreach ($layout in $layouts) {
            $path = "src/layouts/$layout.tsx"
            if (Test-Path $path) {
                $content = Get-Content $path
                if ($content -match "Navbar") {
Write-Output "   ${layout}: YES"
        } else {
            Write-Output "   ${layout}: NO"
                }
            }
        }
        Write-Output ""
        
        # 4. No duplicate Navbar components
        Write-Output "4. Navbar component locations:"
        $navbarFiles = Get-ChildItem -Path "src/components" -Recurse -Filter "Navbar*" -File
        $navbarFiles | ForEach-Object { Write-Output "   $($_.FullName)" }
        Write-Output ""
        
        Write-Output "=== VERIFICATION COMPLETE ==="
    } finally {
        Pop-Location
    }
}