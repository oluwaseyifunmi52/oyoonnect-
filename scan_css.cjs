const fs = require('fs');
const lines = fs.readFileSync('src/index.css', 'utf8').split('\n');
let inC = false, inS = false, q = '', depth = 0;
const stack = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  for (let j = 0; j < l.length; j++) {
    const ch = l[j];
    if (inC) { if (ch === '*' && l[j + 1] === '/') { inC = false; j++; } }
    else if (inS) { if (ch === '\\') j++; else if (ch === q) inS = false; }
    else {
      if (ch === '/' && l[j + 1] === '*') { inC = true; j++; }
      else if (ch === '"' || ch === "'") { inS = true; q = ch; }
      else if (ch === '{') { depth++; stack.push(i + 1); }
      else if (ch === '}') {
        depth--;
        if (depth < 0) { console.log('EXTRA } at line', i + 1); depth = 0; }
        else stack.pop();
      }
    }
  }
}
if (depth > 0) {
  console.log('UNCLOSED blocks, depth=', depth, 'opened at lines:', stack.slice(0, 10));
} else {
  console.log('balanced');
}
