const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/nares/OneDrive/Desktop/Hostel/backend/src/models';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  if (content.match(/collection:\s*'owner_([^']+)'/)) {
    content = content.replace(/collection:\s*'owner_([^']+)'/g, "collection: '$1'");
    fs.writeFileSync(p, content);
    console.log('Updated ' + f);
  } else if (content.match(/collection:\s*'ownerprofiles'/)) {
    content = content.replace(/collection:\s*'ownerprofiles'/g, "collection: 'ownerprofiles'"); // leave this alone maybe? or change to users? ownerprofiles is fine.
  }
});
