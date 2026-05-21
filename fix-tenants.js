const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'frontend/owner/src/pages/Tenants.jsx');

let content = fs.readFileSync(targetFile, 'utf8');

// Replace colors in inline styles (mostly hex string literals)
const colorMap = [
  // Backgrounds
  { regex: /['"]#F8FAFC['"]/gi, replace: '"var(--bg-tertiary)"' },
  { regex: /['"]#F1F5F9['"]/gi, replace: '"var(--bg-main)"' },
  { regex: /['"]#FFFFFF['"]/gi, replace: '"var(--bg-card)"' },
  { regex: /['"]white['"]/gi, replace: '"var(--bg-card)"' },
  
  // Texts
  { regex: /['"]#0F172A['"]/gi, replace: '"var(--text-primary)"' },
  { regex: /['"]#1E293B['"]/gi, replace: '"var(--text-main)"' },
  { regex: /['"]#64748B['"]/gi, replace: '"var(--text-secondary)"' },
  { regex: /['"]#475569['"]/gi, replace: '"var(--text-muted)"' },
  
  // Borders
  { regex: /['"]#E2E8F0['"]/gi, replace: '"var(--border-color)"' },
  { regex: /['"]1px solid #E2E8F0['"]/gi, replace: '"1px solid var(--border-color)"' },
  { regex: /['"]1px solid #F1F5F9['"]/gi, replace: '"1px solid var(--border-color)"' },
  
  // Blue
  { regex: /['"]#EFF6FF['"]/gi, replace: '"var(--bg-blue-soft)"' },
  { regex: /['"]#3B82F6['"]/gi, replace: '"var(--text-blue)"' },
  { regex: /['"]1px solid #3B82F6['"]/gi, replace: '"1px solid var(--text-blue)"' },
  { regex: /['"]1px solid #BFDBFE['"]/gi, replace: '"1px solid var(--color-blue)"' },
  { regex: /['"]#BFDBFE['"]/gi, replace: '"var(--color-blue)"' },
  
  // Green
  { regex: /['"]#D1FAE5['"]/gi, replace: '"var(--bg-green-soft)"' },
  { regex: /['"]#10B981['"]/gi, replace: '"var(--text-green)"' },
  { regex: /['"]#059669['"]/gi, replace: '"var(--text-green)"' },
  { regex: /['"]4px solid #10B981['"]/gi, replace: '"4px solid var(--color-green)"' },
  
  // Yellow/Orange
  { regex: /['"]#FEF3C7['"]/gi, replace: '"var(--bg-yellow-soft)"' },
  { regex: /['"]#F59E0B['"]/gi, replace: '"var(--text-yellow)"' },
  
  // Red
  { regex: /['"]#FEF2F2['"]/gi, replace: '"var(--bg-red-soft)"' },
  { regex: /['"]#FEE2E2['"]/gi, replace: '"var(--bg-red-soft)"' },
  { regex: /['"]#EF4444['"]/gi, replace: '"var(--text-red)"' },
  { regex: /['"]#DC2626['"]/gi, replace: '"var(--text-red)"' },
  { regex: /['"]#991B1B['"]/gi, replace: '"var(--text-red)"' },
  { regex: /['"]1px solid #FECACA['"]/gi, replace: '"1px solid var(--danger-border)"' },
  { regex: /['"]4px solid #EF4444['"]/gi, replace: '"4px solid var(--text-red)"' },
];

colorMap.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

// Other common patterns not caught by exact strings
content = content.replace(/background:\s*['"]rgba\(0,0,0,0.6\)['"]/gi, 'background: "var(--modal-overlay)"');

fs.writeFileSync(targetFile, content, 'utf8');
console.log(`Updated ${targetFile}`);
