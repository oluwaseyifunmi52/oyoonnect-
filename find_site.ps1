& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        dir "src" -Recurse -Filter "site*" -File 2>$null
    } finally {
        Pop-Location
    }
}