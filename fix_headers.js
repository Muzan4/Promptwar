const fs = require('fs');
const path = require('path');

const replacements = [
  // First, completely clean out the broken middle dots injected by the empty string split
  ['·', ''],
  
  // Now replace all the corrupted unicode sequences with proper emojis
  ['Ã°Å¸Å½Â¯', '🎯'],
  ['Ã°Å¸Å¡â‚¬', '🚀'],
  ['Ã¢Å¡â€"Ã¯Â¸Â', '⚖️'],
  ['Ã¢Å¡Â¡', '⚡'],
  ['Ã°Å¸â€˜â€¹', '👋'],
  ['Ã¢Å“â€¦', '✅'],
  ['Ã°Å¸â€˜Â¥', '👥'],
  ['Ã°Å¸â€œÂ¦', '📦'],
  ['Ã°Å¸â€œÂ¢', '📢'],
  ['Ã¢Â Â¤Ã¯Â¸Â', '❤️'],
  
  // Text symbols
  ['Ã¢â‚¬â€œ', '—'],
  ['Ã‚Â©', '©'],
  ['Ã‚Â·', ' • '], // Use bullet instead of middle dot to avoid confusion
  ['Ã¢â‚¬â€ ', '—']
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      for (const [bad, good] of replacements) {
        content = content.split(bad).join(good);
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

['app', 'components', 'lib'].forEach(processDir);
console.log('Successfully cleaned all headers and text!');
