& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        npx grep -n "help" src/App.tsx 2>&1 || findstr /i "help" src\App.tsx
    } finally {
        Pop-Location
    }
}