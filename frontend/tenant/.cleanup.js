const fs = require('fs');

const pages = ['Home.jsx', 'Landing.jsx', 'About.jsx', 'Contact.jsx', 'Terms.jsx', 'Privacy.jsx'];

pages.forEach(file => {
  const p = 'src/pages/' + file;
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');

  if (file === 'Home.jsx') {
    code = code.replace(/<header className="hv2-header">[\s\S]*?<\/header>/, '');
    code = code.replace(/<footer className="hv2-footer">[\s\S]*?<\/footer>/, '');
    code = code.replace(/<a href="https:\/\/wa\.me\/919876543213"[\s\S]*?<\/a>/, '');
    code = code.replace(/\{activeModal && \([\s\S]*?\}\)/g, '');
    code = code.replace(/\{isLocationsOpen && \([\s\S]*?\}\)/g, '');
    
    const sidebarStart = code.indexOf('<div className={`hv2-sidebar-overlay');
    if (sidebarStart !== -1) {
      code = code.substring(0, sidebarStart) + '\n    </div>\n  );\n};\n\nexport default Home;';
    }
  } else {
    code = code.replace(/<header[\s\S]*?<\/header>/, '');
    code = code.replace(/<footer[\s\S]*?<\/footer>/, '');
  }

  fs.writeFileSync(p, code);
});

console.log("Cleanup done.");
