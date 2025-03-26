const fs = require('fs');
const path = require('path');

// Base directory for images
const baseDir = path.join(__dirname, '../public/images');

// Function to format location slug into a title
function formatTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to get all image files in a directory
function getImagesInDir(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    })
    .map(file => {
      // Convert absolute path to relative path from public folder
      const relativePath = path.join('/images', path.relative(path.join(__dirname, '../public/images'), path.join(dir, file)));
      return relativePath.replace(/\\/g, '/'); // Ensure forward slashes for web paths
    });
}

// Main function to generate photos.json
function generatePhotosJson() {
  const photosData = [];
  
  // Get all year directories
  const yearDirs = fs.readdirSync(baseDir)
    .filter(item => {
      const itemPath = path.join(baseDir, item);
      return fs.statSync(itemPath).isDirectory() && /^\d{4}$/.test(item);
    });
  
  // Process each year directory
  yearDirs.forEach(year => {
    const yearDir = path.join(baseDir, year);
    
    // Get all location directories for this year
    const locationDirs = fs.readdirSync(yearDir)
      .filter(item => {
        const itemPath = path.join(yearDir, item);
        return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
      });
    
    // Process each location directory
    locationDirs.forEach(locationSlug => {
      const locationDir = path.join(yearDir, locationSlug);
      const images = getImagesInDir(locationDir);
      
      if (images.length > 0) {
        photosData.push({
          year: parseInt(year),
          locationSlug,
          title: formatTitle(locationSlug),
          description: "A collection of photos from " + formatTitle(locationSlug) + ".",
          camera: "Camera information will be added later",
          lens: "Lens information will be added later",
          images
        });
      }
    });
  });
  
  // Write the data to photos.json
  const outputPath = path.join(__dirname, '../data/photos.json');
  fs.writeFileSync(outputPath, JSON.stringify(photosData, null, 2));
  
  console.log(`Generated photos.json with ${photosData.length} locations`);
}

// Run the generation function
generatePhotosJson(); 