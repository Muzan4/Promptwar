const fs = require('fs');
const path = require('path');

// Target the EXACT weird strings from the output log

const replacements = {
  'Muzan Hackathon 2026 A Auto-updates every 15s': 'Muzan Hackathon 2026 · Auto-updates every 15s',
  '{/* Podium ?" Top 3 */}': '{/* Podium — Top 3 */}',
  'i === 0 ? \'dY\' : i === 1 ? \'dY^\' : \'dY%\'': 'i === 0 ? \'🥇\' : i === 1 ? \'🥈\' : \'🥉\'',
  '<span></span>': '<span>·</span>',
  '`o. ${p.user.name} checked in!`': '`✅ ${p.user.name} checked in!`',
  'f === \'in\' ? \'o. In\' : \'?3 Pending\'': 'f === \'in\' ? \'✅ In\' : \'⏳ Pending\'',
  'Muzan Hackathon 2026  ${liveTime.toLocaleTimeString()}': 'Muzan Hackathon 2026 · ${liveTime.toLocaleTimeString()}',
  'Team: {sub.team.name}  {sub.team.track}': 'Team: {sub.team.name} · {sub.team.track}',
  '${teams.length} teams formed  ${openTeams.length} still open': '${teams.length} teams formed · ${openTeams.length} still open',
  'Muzan Hackathon 2026  Dashboard': 'Muzan Hackathon 2026 · Dashboard',
  'participant?.checkedIn ? \'o. Checked In\' : \'?3 Not Yet\'': 'participant?.checkedIn ? \'✅ Checked In\' : \'⏳ Not Yet\'',
  'Dec 15?"16, 2024 A 36 hours': 'Dec 15—16, 2024 · 36 hours',
  ',15,00,000 prize pool': '₹15,00,000 prize pool',
  '?? You need to be in a team before submitting. Join or create a team first.': '⚠️ You need to be in a team before submitting. Join or create a team first.',
  'placeholder="Describe your project - what it does, why it matters, how you built it..."': 'placeholder="Describe your project — what it does, why it matters, how you built it..."',
  '+? Back': '← Back',
  'Muzan Hackathon ?" Smart Event Management Platform': 'Muzan Hackathon — Smart Event Management Platform',
  'Everything consolidated - zero platform juggling': 'Everything consolidated — zero platform juggling',
  'Full control - manage everything': 'Full control — manage everything',
  'icon: \'A?"A_A,A?\'': 'icon: \'⚖️\'',
  '> QR check-in: A"?o ready': '> QR check-in: ✅ ready',
  '> live leaderboard: A"?o active': '> live leaderboard: ✅ active',
  'Get Started A??T': 'Get Started →',
  'LIVE  Muzan Hackathon 2026  All systems operational': 'LIVE · Muzan Hackathon 2026 · All systems operational',
  'c 2026 Muzan Hackathon  Built with ?? for Hack2Skill ': '© 2026 Muzan Hackathon · Built with ❤️ for Hack2Skill ·',
  'Real-time  Role-based  Beautiful': 'Real-time · Role-based · Beautiful',
  
  // Specific characters that shouldn't match English letters
  '': '·',
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      for (const [key, value] of Object.entries(replacements)) {
        content = content.split(key).join(value);
      }
      
      // Clean up the weird comments
      content = content.replace(/\{\/\*[^a-zA-Z0-9]+(Nav|Hero|Features|CTA|Footer)[^a-zA-Z0-9]+\*\/\}/g, '{/* --- $1 --- */}');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

['app', 'components', 'lib'].forEach(processDir);
console.log('Fixed all remaining files');
