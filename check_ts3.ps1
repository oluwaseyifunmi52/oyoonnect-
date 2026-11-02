& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        npx tsc --noEmit 2>&1
        echo "TYPECHECK PASSED"
    } finally {
        Pop-Location
    }
}