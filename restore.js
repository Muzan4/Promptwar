const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove the incorrectly inserted 'A' character
      // In JS, it might read differently depending on encoding, so we can use the exact buffer or string
      const corruptStr = 'A';
      
      if (content.includes(corruptStr)) {
        content = content.split(corruptStr).join('');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Restored:', fullPath);
      }
    }
  }
}

['app', 'components', 'lib'].forEach(processDir);
console.log('Finished restoring files');
