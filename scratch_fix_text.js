const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Make text darker for light mode readability
      content = content.replace(/text-slate-400/g, 'text-slate-600');
      content = content.replace(/text-slate-300/g, 'text-slate-700');
      content = content.replace(/text-slate-200/g, 'text-slate-800');
      content = content.replace(/text-slate-100/g, 'text-slate-900');
      content = content.replace(/text-slate-50(?!0)/g, 'text-slate-900');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('src/components');
processDir('src/app/dashboard');
