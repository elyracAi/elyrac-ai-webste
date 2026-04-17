const fs = require('fs');

const renames = [
  ['others/Screenshot 2026-04-17 092550.png', 'others/iotec-inbox.png'],
  ['others/Screenshot 2026-04-17 092420.png', 'others/codeclinic-appointments.png'],
  ['others/Screenshot 2026-04-17 093257.png', 'others/codeclinic-patients.png'],
  ['others/Screenshot 2026-04-17 093714.png', 'others/trivox-vapi.png'],
  ['others/WhatsApp Image 2026-03-27 at 9.01.31 AM.jpeg', 'others/attendtrack-copilot.jpeg'],
  ['others/WhatsApp Image 2026-03-27 at 9.01.32 AM.jpeg', 'others/attendtrack-gps.jpeg'],
];

renames.forEach(([from, to]) => {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log('RENAMED:', from, '->', to);
  } else if (fs.existsSync(to)) {
    console.log('ALREADY DONE:', to);
  } else {
    console.log('NOT FOUND:', from);
    // List similar files
    const folder = 'others';
    const files = fs.readdirSync(folder);
    const keyword = from.split('/')[1].substring(0, 15);
    const matches = files.filter(f => f.includes(keyword.substring(0, 10)));
    if (matches.length) console.log('  Similar files:', matches);
  }
});

// Now fix portfolio.html src attributes
let html = fs.readFileSync('portfolio.html', 'utf8');
const fixes = [
  ['others/Screenshot 2026-04-17 092550.png', 'others/iotec-inbox.png'],
  ['others/Screenshot 2026-04-17 092420.png', 'others/codeclinic-appointments.png'],
  ['others/Screenshot 2026-04-17 093257.png', 'others/codeclinic-patients.png'],
  ['others/Screenshot 2026-04-17 093714.png', 'others/trivox-vapi.png'],
  ['others/WhatsApp Image 2026-03-27 at 9.01.31 AM.jpeg', 'others/attendtrack-copilot.jpeg'],
  ['others/WhatsApp Image 2026-03-27 at 9.01.32 AM.jpeg', 'others/attendtrack-gps.jpeg'],
];
fixes.forEach(([from, to]) => {
  html = html.split(from).join(to);
});
fs.writeFileSync('portfolio.html', html);
console.log('portfolio.html updated.');
