const { execSync } = require('child_process');
try {
  console.log(execSync('git restore .', { encoding: 'utf8' }));
  console.log('Restore successful');
} catch (e) {
  console.error('Failed', e);
}
