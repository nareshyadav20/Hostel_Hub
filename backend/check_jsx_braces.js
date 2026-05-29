const fs = require('fs');

const code = fs.readFileSync('C:/Users/gadda/OneDrive/Desktop/Hostel man/Hostel_Hub/frontend/admin/src/Dashboard.jsx', 'utf8');

// Simple regex parser to track JSX tags
const lines = code.split('\n');
const tagStack = [];

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  
  // Find tags like <div ... > or </div>
  // Avoid self-closing tags like <img ... /> or <input ... />
  // Avoid comments
  let temp = line.trim();
  if (temp.startsWith('//') || temp.startsWith('/*')) return;
  
  const matches = line.matchAll(/<(\/?[a-zA-Z0-9\.]+)(?:\s|>|\/)/g);
  for (const match of matches) {
    const tagName = match[1];
    
    // Check if it is self-closing in the line, e.g. <input ... />
    const tagIndex = match.index;
    const rest = line.substring(tagIndex);
    const isSelfClosing = /\/>/.test(rest.split('>')[0] || '');
    
    if (isSelfClosing) {
      // Self closing tag, ignore
      continue;
    }
    
    if (tagName.startsWith('/')) {
      const closingName = tagName.substring(1);
      if (tagStack.length === 0) {
        console.log(`Line ${lineNum}: Unmatched closing tag </${closingName}>`);
      } else {
        const lastOpened = tagStack.pop();
        if (lastOpened.name !== closingName) {
          console.log(`Line ${lineNum}: Mismatched closing tag </${closingName}> (expected </${lastOpened.name}> opened at Line ${lastOpened.lineNum})`);
          // Put it back to keep tracking
          tagStack.push(lastOpened);
        }
      }
    } else {
      tagStack.push({ name: tagName, lineNum });
    }
  }
});

if (tagStack.length > 0) {
  console.log('Unclosed tags at end of file:');
  tagStack.forEach(t => {
    console.log(`  <${t.name}> opened at Line ${t.lineNum}`);
  });
} else {
  console.log('All tags are perfectly matched!');
}
