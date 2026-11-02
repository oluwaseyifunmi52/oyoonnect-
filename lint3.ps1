& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        npx eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 2>&1
        echo "LINT PASSED"
    } finally {
        Pop-Location
    }
}