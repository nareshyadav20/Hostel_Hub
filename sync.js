const fs = require('fs');

const portfolioPath = 'C:/Users/Dell/Hostel_Hub/Hostel_Hub/frontend/owner/src/pages/Portfolio.jsx';
const cardPath = 'C:/Users/Dell/Hostel_Hub/Hostel_Hub/frontend/owner/src/components/BuildingCard.jsx';

let portfolioCode = fs.readFileSync(portfolioPath, 'utf8');
let cardCode = fs.readFileSync(cardPath, 'utf8');

// Find the start of BuildingCard in Portfolio.jsx
const marker = 'const BuildingCard = ({';
const startIndex = portfolioCode.indexOf(marker);

if (startIndex === -1) {
    console.log('Could not find BuildingCard in Portfolio.jsx');
    process.exit(1);
}

// Extract everything before BuildingCard
const portfolioTop = portfolioCode.substring(0, startIndex);

// Strip imports from cardCode
// Also, the inline BuildingCard in Portfolio.jsx shouldn't have `export default BuildingCard;`
let strippedCardCode = cardCode
    .replace(/^import .*$/gm, '') // Remove imports
    .replace(/export default BuildingCard;/, '') // Remove export
    .trim();

// The card in Portfolio.jsx had `onNavigate, onRefresh, onImageClick, onResubmit`.
// Our new one has `onNavigate, onRefresh, onImageClick, onResubmit, onEdit`.
// Since onEdit isn't passed in Portfolio.jsx, let's keep it but handle if it's undefined (it already is handled or will just fail if clicked, but let's just make it do nothing if not passed).
strippedCardCode = strippedCardCode.replace('onEdit(building.id)', 'onEdit && onEdit(building.id)');

// Write back
fs.writeFileSync(portfolioPath, portfolioTop + strippedCardCode + '\n');
console.log('Successfully replaced inline BuildingCard in Portfolio.jsx');
