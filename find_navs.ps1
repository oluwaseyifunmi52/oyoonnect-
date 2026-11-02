& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        dir "src" -Recurse -Filter "*Navbar*" -File 2>$null
        dir "src" -Recurse -Filter "*Nav*" -File 2>$null
        dir "src" -Recurse -Filter "*Header*" -File 2>$null
    } finally {
        Pop-Location
    }
}