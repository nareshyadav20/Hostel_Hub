const fs = require('fs');
const file = 'frontend/owner/src/components/BuildingCard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Active block
content = content.replace(/<span style=\{\{ fontSize: '0\.85rem', fontWeight: '700', color: \(building\.buildingStatus \|\| building\.status\) === 'Active' \? '#10B981' : '#F59E0B' \}\}>[\s\S]*?<\/span>\s*<span style=\{\{ color: '#CBD5E1' \}\}>•<\/span>\s*/g, '');

// 2. Remove emojis from Floors/Rooms/Beds
content = content.replace(/🏢 /g, '');
content = content.replace(/🚪 /g, '');
content = content.replace(/🛏️ /g, '');

// 3. Remove Occupancy emojis
content = content.replace(/📈 Occupancy/g, 'Occupancy');

// 4. Remove Edit emojis
content = content.replace(/✏️ Edit/g, 'Edit');

// 5. Remove Delete modal emojis
content = content.replace(/❌ \{deleteError\}/g, '{deleteError}');
content = content.replace(/⚠️ /g, '');

// 6. Fix Edit button onClick
content = content.replace(/onEdit\(building\.id\)/g, 'onEdit ? onEdit(building.id) : null');

fs.writeFileSync(file, content);
