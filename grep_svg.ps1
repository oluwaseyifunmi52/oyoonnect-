& {
    Push-Location C:\Users\USER\OneDrive\Desktop\OyoConnect
    try {
        grep -n "svg" src/components/help/ReportButton.tsx src/components/help/SupportAmountSelector.tsx
    } finally {
        Pop-Location
    }
}