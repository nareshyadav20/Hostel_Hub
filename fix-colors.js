const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/owner/src');

const colorMap = [
  // Badges & Icons Backgrounds
  { regex: /background(?:-color)?:\s*#e0f2fe(?=\s*[,;}!])/gi, replace: 'background: var(--bg-blue-soft)' },
  { regex: /background(?:-color)?:\s*#fee2e2(?=\s*[,;}!])/gi, replace: 'background: var(--bg-red-soft)' },
  { regex: /background(?:-color)?:\s*#dcfce7(?=\s*[,;}!])/gi, replace: 'background: var(--bg-green-soft)' },
  { regex: /background(?:-color)?:\s*#ffedd5(?=\s*[,;}!])/gi, replace: 'background: var(--bg-orange-soft)' },
  { regex: /background(?:-color)?:\s*#fef9c3(?=\s*[,;}!])/gi, replace: 'background: var(--bg-yellow-soft)' },
  { regex: /background(?:-color)?:\s*#dbeafe(?=\s*[,;}!])/gi, replace: 'background: var(--bg-blue-soft)' },
  { regex: /background(?:-color)?:\s*rgba\(239,\s*68,\s*68,\s*0\.1\)/gi, replace: 'background: var(--bg-red-soft)' },
  { regex: /background(?:-color)?:\s*rgba\(16,\s*185,\s*129,\s*0\.1\)/gi, replace: 'background: var(--bg-green-soft)' },

  // Badges & Icons Texts
  { regex: /color:\s*#0284c7(?=\s*[,;}!])/gi, replace: 'color: var(--text-blue)' },
  { regex: /color:\s*#dc2626(?=\s*[,;}!])/gi, replace: 'color: var(--text-red)' },
  { regex: /color:\s*#16a34a(?=\s*[,;}!])/gi, replace: 'color: var(--text-green)' },
  { regex: /color:\s*#ea580c(?=\s*[,;}!])/gi, replace: 'color: var(--text-orange)' },
  { regex: /color:\s*#a16207(?=\s*[,;}!])/gi, replace: 'color: var(--text-yellow)' },
  { regex: /color:\s*#1d4ed8(?=\s*[,;}!])/gi, replace: 'color: var(--text-blue)' },
  { regex: /color:\s*#15803d(?=\s*[,;}!])/gi, replace: 'color: var(--text-green)' },
  { regex: /color:\s*#b91c1c(?=\s*[,;}!])/gi, replace: 'color: var(--text-red)' },
  { regex: /color:\s*#EF4444(?=\s*[,;}!])/gi, replace: 'color: var(--text-red)' },
  { regex: /color:\s*#10B981(?=\s*[,;}!])/gi, replace: 'color: var(--text-green)' },
  
  // Specific border colors
  { regex: /border-color:\s*#EF4444(?=\s*[,;}!])/gi, replace: 'border-color: var(--danger-border)' },
  { regex: /border-left-color:\s*#EF4444(?=\s*[,;}!])/gi, replace: 'border-left-color: var(--danger-border)' },
  { regex: /border-left-color:\s*#10B981(?=\s*[,;}!])/gi, replace: 'border-left-color: var(--color-green)' },
  { regex: /border-color:\s*#10B981(?=\s*[,;}!])/gi, replace: 'border-color: var(--color-green)' },
  { regex: /border-color:\s*#6366F1(?=\s*[,;}!])/gi, replace: 'border-color: var(--color-blue)' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  colorMap.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(srcDir);
console.log("Done.");
