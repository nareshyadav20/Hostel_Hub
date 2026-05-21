const fs = require('fs');
const path = require('path');

const filesToFix = [
  'frontend/owner/src/pages/Settings.jsx',
  'frontend/owner/src/pages/Settings.css',
  'frontend/owner/src/pages/Staff.jsx',
  'frontend/owner/src/pages/Staff.css'
];

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
  { regex: /['"]2px solid #E2E8F0['"]/gi, replace: '"2px solid var(--border-color)"' },
  
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

  // Case-insensitive generic replacements mostly for CSS or other inline strings
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

  // Plain CSS replacements (not surrounded by quotes)
  { regex: /background(?:-color)?:\s*#F8FAFC(?=\s*[,;}!])/gi, replace: 'background: var(--bg-tertiary)' },
  { regex: /background(?:-color)?:\s*#F1F5F9(?=\s*[,;}!])/gi, replace: 'background: var(--bg-main)' },
  { regex: /background(?:-color)?:\s*#FFFFFF(?=\s*[,;}!])/gi, replace: 'background: var(--bg-card)' },
  { regex: /background(?:-color)?:\s*white(?=\s*[,;}!])/gi, replace: 'background: var(--bg-card)' },
  { regex: /color:\s*#0F172A(?=\s*[,;}!])/gi, replace: 'color: var(--text-primary)' },
  { regex: /color:\s*#1E293B(?=\s*[,;}!])/gi, replace: 'color: var(--text-main)' },
  { regex: /color:\s*#64748B(?=\s*[,;}!])/gi, replace: 'color: var(--text-secondary)' },
  { regex: /color:\s*#475569(?=\s*[,;}!])/gi, replace: 'color: var(--text-muted)' },
  { regex: /border-color:\s*#E2E8F0(?=\s*[,;}!])/gi, replace: 'border-color: var(--border-color)' },
  { regex: /border:\s*1px solid #E2E8F0(?=\s*[,;}!])/gi, replace: 'border: 1px solid var(--border-color)' },
  { regex: /background(?:-color)?:\s*#EFF6FF(?=\s*[,;}!])/gi, replace: 'background: var(--bg-blue-soft)' },
  { regex: /color:\s*#3B82F6(?=\s*[,;}!])/gi, replace: 'color: var(--text-blue)' },
  { regex: /border:\s*1px solid #3B82F6(?=\s*[,;}!])/gi, replace: 'border: 1px solid var(--text-blue)' },
  { regex: /background(?:-color)?:\s*#D1FAE5(?=\s*[,;}!])/gi, replace: 'background: var(--bg-green-soft)' },
  { regex: /color:\s*#10B981(?=\s*[,;}!])/gi, replace: 'color: var(--text-green)' },
  { regex: /color:\s*#059669(?=\s*[,;}!])/gi, replace: 'color: var(--text-green)' },
  { regex: /background(?:-color)?:\s*#FEF3C7(?=\s*[,;}!])/gi, replace: 'background: var(--bg-yellow-soft)' },
  { regex: /color:\s*#F59E0B(?=\s*[,;}!])/gi, replace: 'color: var(--text-yellow)' },
  { regex: /background(?:-color)?:\s*#FEF2F2(?=\s*[,;}!])/gi, replace: 'background: var(--bg-red-soft)' },
  { regex: /color:\s*#EF4444(?=\s*[,;}!])/gi, replace: 'color: var(--text-red)' },
  { regex: /color:\s*#DC2626(?=\s*[,;}!])/gi, replace: 'color: var(--text-red)' },
  
  // Specific UI colors
  { regex: /['"]#8B5CF6['"]/gi, replace: '"var(--text-indigo)"' },
  { regex: /['"]#F59E0B['"]/gi, replace: '"var(--text-yellow)"' },
];

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;

    colorMap.forEach(({ regex, replace }) => {
      content = content.replace(regex, replace);
    });

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${fullPath}`);
    }
  }
});
console.log("Done.");
