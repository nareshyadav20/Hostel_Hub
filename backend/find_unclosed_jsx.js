const fs = require('fs');

const code = fs.readFileSync('C:/Users/gadda/OneDrive/Desktop/Hostel man/Hostel_Hub/frontend/admin/src/Dashboard.jsx', 'utf8');

// Strip comments
let clean = code
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*$/gm, '');

// Robust tags scanner
let pos = 0;
const stack = [];

while (pos < clean.length) {
  if (clean[pos] === '<') {
    if (clean.substring(pos, pos + 4) === '<!--') {
      pos = clean.indexOf('-->', pos) + 3;
      continue;
    }
    
    let endPos = pos + 1;
    let inString = false;
    let stringChar = null;
    let braceCount = 0;
    
    while (endPos < clean.length) {
      const char = clean[endPos];
      if (inString) {
        if (char === stringChar && clean[endPos - 1] !== '\\') {
          inString = false;
        }
      } else if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
      } else if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
      } else if (char === '>' && braceCount === 0) {
        break;
      }
      endPos++;
    }
    
    const tagContent = clean.substring(pos, endPos + 1);
    pos = endPos + 1;
    
    const tagMatch = tagContent.match(/^<(\/?[a-zA-Z0-9\._\-]+)/);
    if (!tagMatch) continue;
    
    const tagName = tagMatch[1];
    
    // Ignore self closing tags
    const isSelfClosing = tagContent.endsWith('/>') || 
                          ['input', 'textarea', 'img', 'br', 'hr', 'Plus', 'Download', 'Search', 'Filter', 'X', 'MoreVertical', 'Building2', 'UserCheck', 'Users', 'Activity', 'CreditCard', 'Package', 'TrendingUp', 'TrendingDown', 'ShieldCheck', 'Lock', 'Database', 'Globe'].includes(tagName);
    
    if (isSelfClosing) continue;
    
    const lineNum = clean.substring(0, pos).split('\n').length;
    
    if (tagName.startsWith('/')) {
      const name = tagName.substring(1);
      if (stack.length === 0) {
        console.log(`Mismatch: closing tag </${name}> at line ${lineNum} has no open tag`);
      } else {
        const last = stack.pop();
        if (last.name !== name) {
          console.log(`Mismatch: closing tag </${name}> at line ${lineNum} mismatches opening tag <${last.name}> from line ${last.lineNum}`);
          stack.push(last);
        }
      }
    } else {
      stack.push({ name: tagName, lineNum });
    }
  } else {
    pos++;
  }
}

console.log('Unclosed tags at end of parsing:');
stack.forEach(s => {
  console.log(`  <${s.name}> opened at line ${s.lineNum}`);
});
