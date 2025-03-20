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

// Ensure public directory exists
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write to a JSON file
try {
  fs.writeFileSync(
    path.join(publicDir, 'build-meta.json'),
    JSON.stringify(buildMeta, null, 2)
  );
  console.log('Build metadata generated successfully');
} catch (error) {
  console.error('Error writing build metadata:', error);
  // Don't fail the build because of metadata
  process.exit(0);
} 