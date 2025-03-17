const fs = require('fs');
const path = require('path');

// Generate build date in MM/DD/YYYY format
const buildDate = new Date().toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric'
});

// Create the build meta data
const buildMeta = {
  buildDate: buildDate
};

// Write to a JSON file
fs.writeFileSync(
  path.join(process.cwd(), 'public', 'build-meta.json'),
  JSON.stringify(buildMeta, null, 2)
); 