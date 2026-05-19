const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/gadda/OneDrive/Desktop/Hostel man/Hostel_Hub/frontend/admin/src';
const filesToCheck = {
  'Dashboard': 'Dashboard.jsx',
  'Hostels': 'pages/Hostels.jsx',
  'Owners': 'pages/Owners.jsx',
  'Tenants': 'pages/Tenants.jsx',
  'Staff': 'pages/Staff.jsx',
  'Bookings': 'pages/Bookings.jsx',
  'Analytics': 'pages/Analytics.jsx',
  'CMS': 'pages/Cms.jsx',
  'Issues': 'pages/Issues.jsx',
  'Finance': 'pages/Finance.jsx',
  'Insights': 'pages/Insights.jsx',
  'Support': 'pages/Support.jsx',
  'Settings': 'pages/Settings.jsx',
  'Profile': 'pages/Profile.jsx'
};

for (const [name, relPath] of Object.entries(filesToCheck)) {
  const fullPath = path.join(baseDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[${name}] File not found!`);
    continue;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Look for API calls
  const matches = content.match(/API\.(get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]/g) || [];
  if (matches.length > 0) {
    console.log(`[${name}] Connected. API calls found:`);
    const uniqueCalls = Array.from(new Set(matches));
    uniqueCalls.forEach(call => console.log(`  - ${call}`));
  } else {
    console.log(`[${name}] Not connected to backend (Uses frontend mock data or placeholders).`);
  }
}
