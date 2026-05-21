const fs = require('fs');
const path = require('path');

const colorMap = [
  // Staff Roles & Badges
  { regex: /['"]#2563EB['"]/gi, replace: '"var(--text-blue)"' },
  { regex: /['"]#FFF7ED['"]/gi, replace: '"var(--bg-orange-soft)"' },
  { regex: /['"]#EA580C['"]/gi, replace: '"var(--text-orange)"' },
  { regex: /['"]#FED7AA['"]/gi, replace: '"var(--text-orange)"' },
  { regex: /['"]#FDF4FF['"]/gi, replace: '"var(--bg-indigo-soft)"' }, // using indigo soft as fallback
  { regex: /['"]#9333EA['"]/gi, replace: '"var(--text-indigo)"' },
  { regex: /['"]#E9D5FF['"]/gi, replace: '"var(--text-indigo)"' },
  { regex: /['"]#F0FDF4['"]/gi, replace: '"var(--bg-green-soft)"' },
  { regex: /['"]#16A34A['"]/gi, replace: '"var(--text-green)"' },
  { regex: /['"]#BBF7D0['"]/gi, replace: '"var(--text-green)"' },
  { regex: /['"]rgba\(107, 114, 128, 0.1\)['"]/gi, replace: '"var(--bg-tertiary)"' },
  { regex: /['"]#6B7280['"]/gi, replace: '"var(--text-muted)"' },
  
  // Gradients and Box shadows
  { regex: /linear-gradient\(135deg,\s*#6366F1,\s*#4F46E5\)/gi, replace: 'var(--color-blue)' },
  { regex: /rgba\(99,\s*102,\s*241,\s*0\.4\)/gi, replace: 'rgba(0, 0, 0, 0.2)' },
  
  // Performance & Filter buttons
  { regex: /['"]#A7F3D0['"]/gi, replace: '"var(--text-green)"' },
  { regex: /['"]#ECFDF5['"]/gi, replace: '"var(--bg-green-soft)"' },
  { regex: /['"]#FECACA['"]/gi, replace: '"var(--danger-border)"' },
  { regex: /['"]#D97706['"]/gi, replace: '"var(--text-yellow)"' },
  { regex: /['"]#FFF['"]/gi, replace: '"var(--text-on-primary)"' },
  
  // Delete button
  { regex: /['"]#FFF1F2['"]/gi, replace: '"var(--bg-red-soft)"' },
  { regex: /['"]#E11D48['"]/gi, replace: '"var(--text-red)"' },
];

const files = ['frontend/owner/src/pages/Staff.jsx', 'frontend/owner/src/pages/Settings.jsx'];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    colorMap.forEach(({ regex, replace }) => {
      content = content.replace(regex, replace);
    });
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${fullPath}`);
  }
});
