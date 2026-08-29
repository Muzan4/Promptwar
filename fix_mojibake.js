const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Replace corrupted strings. We can just use a regex to strip non-ascii characters, 
      // but let's be careful not to strip valid stuff if we can avoid it.
      // Actually, since these files only need basic ASCII for code, we can just strip all non-ASCII.
      const original = content;
      content = content.replace(/[^\x00-\x7F]/g, '');
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'app'));
processDir(path.join(__dirname, 'components'));

