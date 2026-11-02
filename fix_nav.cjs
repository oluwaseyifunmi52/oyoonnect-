const fs = require("fs");

let content = fs.readFileSync("src/components/layout/Navbar.tsx", "utf8");

// Find the nav-links closing and the isAuthenticated marker
// Use indexOf instead of find (which doesn't exist on strings in JS)
const navLinksEnd = content.indexOf("        </div>\n\n          {isAuthenticated");
console.log("nav-links end at:", navLinksEnd);

if (navLinksEnd !== -1) {
    // Keep everything up to nav-links closing
    const firstPart = content.substring(0, navLinksEnd + "        </div>\n\n".length);
    
    // The buttons to insert
    const buttonsHtml = `          <div style="display: 'flex', gap: '8px', alignItems: 'center'>
            <button
              type="button"
              className="navbar__theme-toggle"
              aria-label="Switch to " + (resolved === 'dark' ? 'light' : 'dark') + " mode"
              onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
            >
              {resolved === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
            </button>
            <ButtonLink to="/login" variant="ghost" size="sm" onClick={closeMobileMenu}>Sign In</ButtonLink>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="navbar__cta"
              onClick={() => { closeMobileMenu(); setGetStartedOpen(true) }}
            >
              Get Started <ArrowRight size={16} />
            </Button>
          </div>`;
    
    // Insert buttons after nav-links closing
    const newContent = firstPart + buttonsHtml + content.substring(navLinksEnd + "        </div>\n\n".length);
    
    // Now remove the isAuthenticated conditional and alternative layout
    // Find the start of the conditional
    const conditionalStart = content.indexOf("{isAuthenticated ? (", navLinksEnd);
    console.log("conditional start at:", conditionalStart);
    
    if (conditionalStart !== -1) {
        // Find where the alternative layout ends
        // Look for the pattern that marks the end
        const altPattern = "            </div>\n          )}";
        const altEnd = content.indexOf(altPattern, conditionalStart);
        console.log("alt end at:", altEnd);
        
        if (altEnd !== -1) {
            // Build the final content: up to conditional start, then after alt end
            const beforeConditional = content.substring(0, conditionalStart);
            const afterAlternative = content.substring(altEnd + altPattern.length);
            const finalContent = beforeConditional + afterAlternative;
            
            fs.writeFileSync("src/components/layout/Navbar.tsx", finalContent);
            console.log("File rewritten successfully, length:", finalContent.length);
        } else {
            console.log("Could not find alt end pattern");
        }
    } else {
        console.log("Could not find conditional start");
    }
} else {
    console.log("Could not find nav-links end");
}