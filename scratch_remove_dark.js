const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove inline tailwind dark classes
      if (fullPath.endsWith('.tsx')) {
        content = content.replace(/dark:[a-z0-9\-]+/g, '');
      }
      
      // Remove custom dark overrides in css
      if (fullPath.endsWith('globals.css')) {
        content = content.replace(/\.dark\s+\.glass-panel\s*\{[^}]+\}/g, '');
        content = content.replace(/\.dark\s+\.glass-card\s*\{[^}]+\}/g, '');
        content = content.replace(/\.dark\s+\.glass-card:hover\s*\{[^}]+\}/g, '');
      }
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('src/components');
processDir('src/app/dashboard');
processDir('src/app/globals.css'.replace('globals.css', ''));
