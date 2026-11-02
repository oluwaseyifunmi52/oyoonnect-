#!/usr/bin/env python3
import re

with open('src/components/layout/Navbar.tsx', 'r') as f:
    content = f.read()

# Remove the isAuthenticated conditional block and keep only desktop layout
# Keep: nav-links div, right-side buttons (theme toggle, Sign In, Get Started)
# Remove: the isAuthenticated ? (...) : (...) conditional block and the alternative layout

# Find and replace the pattern
# The pattern to remove starts with {isAuthenticated ? ( and ends with the alternative : (...) layout

# Let's use regex to find and replace
# We want to keep the nav-links div and the right-side buttons

# First, let's find the nav-links div and its closing
# Pattern: <div className="nav-links"> followed by siteConfig.nav.map, then closing </div>
# Then the isAuthenticated conditional

# Strategy: Replace the entire block from after nav-links closing to the end of the page
# with just the right-side buttons

# Find the position after the nav-links closing div
nav_links_end = content.find('        </div>\n\n          {isAuthenticated')
if nav_links_end == -1:
    # Try alternative pattern
    nav_links_end = content.find('        </div>')
    
print(f"Found nav-links end at position: {nav_links_end}")

# Find the alternative layout start (the : (...) part)
alt_start = content.find('          ) : (', nav_links_end)
alt_end = content.find('            </div>\n          )', alt_start)

print(f"Alternative layout: {alt_start} to {alt_end}")

# Now, what we want to keep:
# 1. The nav-links div and its content (up to line 276)
# 2. The right-side buttons (theme toggle, Sign In, Get Started)

# Let's reconstruct the content:
# Keep everything up to and including the nav-links closing div
# Then add the right-side buttons
# Then skip the isAuthenticated conditional and alternative layout

# Actually, let me take a simpler approach: just remove the isAuthenticated conditional
# and the alternative layout, keeping only the common parts

# Find {isAuthenticated ? ( and the matching closing
import re

# Pattern to find the isAuthenticated conditional block
pattern = r'\{isAuthenticated \? \(.*?\) : \(.*?\)\n\s*<div style='
match = re.search(pattern, content, re.DOTALL)
if match:
    print(f"Found pattern: {match.start()} to {match.end()}")
    # Remove this pattern and replace with just the buttons
    # But we need to keep the nav-links div

# Let me just manually reconstruct
# Lines to keep: up to and including the nav-links div closing
# Then add buttons

# Split by the isAuthenticated marker
parts = content.split('{isAuthenticated ? (')
if len(parts) >= 2:
    # Keep the first part (up to isAuthenticated)
    first_part = parts[0]
    # Now find where the alternative layout ends and remove everything in between
    # The second part starts with the isAuthenticated ? block and contains the alternative
    
    # Find the end of the alternative layout
    # Look for the pattern that ends the whole return statement
    second_part = parts[1]
    
    # Extract just the nav-links div and buttons from the first part
    # The nav-links div should be there
    
    # Now add the right-side buttons after the nav-links div
    buttons_html = '''          <div style="display: 'flex', gap: '8px', alignItems: 'center'">
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
          </div>'''
    
    # Insert the buttons after the nav-links div
    # Find the position of the nav-links closing div in the first part
    nav_links_close = first_part.find('        </div>')
    if nav_links_close != -1:
        # Insert buttons after the nav-links closing div
        new_content = first_part[:nav_links_close + len('        </div>\n')] + buttons_html + '\n' + first_part[nav_links_close + len('        </div>\n'):]
        
        # Now remove the rest (the isAuthenticated conditional and alternative layout)
        # Find where the broken content starts
        remaining = new_content.find('          ) : (', nav_links_close)
        if remaining != -1:
            new_content = new_content[:remaining]
        
        with open('src/components/layout/Navbar.tsx', 'w') as f:
            f.write(new_content)
        
        print("File rewritten successfully")
    else:
        print("Could not find nav-links closing div")
else:
    print("Could not split on isAuthenticated pattern")