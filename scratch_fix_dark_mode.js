const fs = require('fs');
const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/text-slate-900(?! dark:)/g, 'text-slate-900 dark:text-white');
content = content.replace(/text-slate-800(?! dark:)/g, 'text-slate-800 dark:text-slate-100');
content = content.replace(/text-slate-700(?! dark:)/g, 'text-slate-700 dark:text-slate-200');
content = content.replace(/text-slate-600(?! dark:)/g, 'text-slate-600 dark:text-slate-300');
content = content.replace(/text-slate-500(?! dark:)/g, 'text-slate-500 dark:text-slate-400');
content = content.replace(/bg-white(?! dark:)/g, 'bg-white dark:bg-slate-900');
content = content.replace(/bg-slate-100(?! dark:)/g, 'bg-slate-100 dark:bg-slate-800');
content = content.replace(/border-slate-100(?! dark:)/g, 'border-slate-100 dark:border-slate-800');
content = content.replace(/border-slate-200(?! dark:)/g, 'border-slate-200 dark:border-slate-700');

fs.writeFileSync(path, content);
