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
      const original = content;
      // Remove the Unicode replacement character explicitly
      content = content.replace(/\uFFFD/g, '');
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'app'));
processDir(path.join(__dirname, 'components'));

