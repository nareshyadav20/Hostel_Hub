const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'frontend/owner/src/pages/Tenants.jsx');

let content = fs.readFileSync(targetFile, 'utf8');

const colorMap = [
  { regex: /['"]#(?:94A3B8|94a3b8)['"]/gi, replace: '"var(--text-muted)"' },
  { regex: /['"]#(?:3B82F6|3b82f6)['"]/gi, replace: '"var(--text-blue)"' },
  { regex: /['"]#(?:BFDBFE|bfdbfe)['"]/gi, replace: '"var(--color-blue)"' },
  { regex: /['"]#(?:1E3A8A|1e3a8a|1E40AF|1e40af)['"]/gi, replace: '"var(--text-blue)"' },
  { regex: /['"]#(?:FFFBEB|fffbeb)['"]/gi, replace: '"var(--bg-yellow-soft)"' },
  { regex: /['"]#(?:FDE68A|fde68a|B45309|b45309|92400E|92400e)['"]/gi, replace: '"var(--text-yellow)"' },
  { regex: /['"]#(?:E2E8F0|e2e8f0|CBD5E1|cbd5e1)['"]/gi, replace: '"var(--border-color)"' },
  { regex: /['"]#(?:10B981|10b981)['"]/gi, replace: '"var(--text-green)"' },
  { regex: /['"]3px solid #3B82F6['"]/gi, replace: '"3px solid var(--text-blue)"' },
  { regex: /['"]2px solid #3B82F6['"]/gi, replace: '"2px solid var(--text-blue)"' },
  { regex: /['"]2px dashed #E2E8F0['"]/gi, replace: '"2px dashed var(--border-color)"' },
  { regex: /['"]1px solid #FDE68A['"]/gi, replace: '"1px solid var(--text-yellow)"' },
  { regex: /['"]2px solid #10B981['"]/gi, replace: '"2px solid var(--text-green)"' },
  { regex: /['"]0 1px 0 #E2E8F0['"]/gi, replace: '"0 1px 0 var(--border-color)"' },
  { regex: /['"]1px solid #10B981['"]/gi, replace: '"1px solid var(--text-green)"' },
  { regex: /['"]2px dashed #CBD5E1['"]/gi, replace: '"2px dashed var(--border-color)"' },
  { regex: /['"]5px solid #E2E8F0['"]/gi, replace: '"5px solid var(--border-color)"' },
  { regex: /border-bottom-color:\s*#3B82F6/gi, replace: 'border-bottom-color: var(--text-blue)' },
];

colorMap.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

fs.writeFileSync(targetFile, content, 'utf8');
console.log(`Updated ${targetFile}`);
