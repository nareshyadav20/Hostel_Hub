const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'frontend/owner/src/pages/Settings.css');
const jsxPath = path.join(__dirname, 'frontend/owner/src/pages/Settings.jsx');

if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');

  // Replace variable declarations
  css = css.replace(/--settings-primary:\s*#4f46e5;/g, '--settings-primary: var(--color-blue-dark);');
  css = css.replace(/--settings-secondary:\s*#6366f1;/g, '--settings-secondary: var(--color-blue);');
  css = css.replace(/--settings-accent:\s*#8b5cf6;/g, '--settings-accent: var(--text-indigo);');
  css = css.replace(/--settings-bg:\s*#f8fafc;/g, '--settings-bg: var(--bg-main);');
  css = css.replace(/--settings-card-bg:\s*#ffffff;/g, '--settings-card-bg: var(--bg-card);');
  css = css.replace(/--settings-text-main:\s*#0f172a;/g, '--settings-text-main: var(--text-main);');
  css = css.replace(/--settings-text-muted:\s*#64748b;/g, '--settings-text-muted: var(--text-muted);');
  css = css.replace(/--settings-border:\s*#e2e8f0;/g, '--settings-border: var(--border-color);');
  css = css.replace(/--settings-success:\s*#10b981;/g, '--settings-success: var(--text-green);');
  css = css.replace(/--settings-danger:\s*#ef4444;/g, '--settings-danger: var(--text-red);');
  css = css.replace(/--settings-warning:\s*#f59e0b;/g, '--settings-warning: var(--text-yellow);');

  // Replace inline occurrences
  css = css.replace(/1px solid #f1f5f9/g, '1px solid var(--border-color)');
  css = css.replace(/background:\s*#e2e8f0/g, 'background: var(--bg-tertiary)');
  css = css.replace(/background:\s*#ecfdf5/g, 'background: var(--bg-green-soft)');
  css = css.replace(/border:\s*1px solid #d1fae5/g, 'border: 1px solid var(--text-green)');
  css = css.replace(/border:\s*1px solid #fee2e2/g, 'border: 1px solid var(--danger-border)');

  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Fixed Settings.css');
}

if (fs.existsSync(jsxPath)) {
  let jsx = fs.readFileSync(jsxPath, 'utf8');

  // Remaining fixes in JSX
  jsx = jsx.replace(/['"]#4F46E5['"]/gi, '"var(--color-blue-dark)"');
  jsx = jsx.replace(/['"]#EEF2FF['"]/gi, '"var(--bg-indigo-soft)"');
  jsx = jsx.replace(/['"]#F5F3FF['"]/gi, '"var(--bg-indigo-soft)"');
  jsx = jsx.replace(/['"]#DB2777['"]/gi, '"var(--text-red)"'); // using red as fallback for pink
  jsx = jsx.replace(/['"]#FDF2F8['"]/gi, '"var(--bg-red-soft)"');

  fs.writeFileSync(jsxPath, jsx, 'utf8');
  console.log('Fixed Settings.jsx');
}
