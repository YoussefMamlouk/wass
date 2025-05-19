const fs = require('fs');
const path = require('path');

// Base directory for images
const imagesDir = path.join(__dirname, 'images');

// Output file
const outputFile = path.join(__dirname, 'image-data.json');

// Result structure
const imageData = {
    folders: {},
    firstImages: {}
};

// Read all directories in the images folder
const directories = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

console.log('Found directories:', directories);

// Process each directory
directories.forEach(folder => {
    const folderPath = path.join(imagesDir, folder);
    
    // Get all image files in the folder
    const imageFiles = fs.readdirSync(folderPath)
        .filter(file => {
            const extension = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension);
        })
        .map(file => `images/${folder}/${file}`);
    
    // Store all images for this folder
    imageData.folders[folder] = imageFiles;
    
    // Store the first image for thumbnails
    if (imageFiles.length > 0) {
        imageData.firstImages[folder] = imageFiles[0];
    }
    
    // Check for caption.txt
    const captionPath = path.join(folderPath, 'caption.txt');
    if (fs.existsSync(captionPath)) {
        try {
            const captionText = fs.readFileSync(captionPath, 'utf8');
            if (!imageData.captions) {
                imageData.captions = {};
            }
            imageData.captions[folder] = captionText;
            console.log(`Caption found for ${folder}`);
        } catch (error) {
            console.error(`Error reading caption for ${folder}:`, error);
        }
    } else {
        console.log(`No caption.txt found for ${folder}`);
    }
});

// Write the data to a JSON file
fs.writeFileSync(outputFile, JSON.stringify(imageData, null, 2));

console.log(`Image data generated successfully in ${outputFile}`); 