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

// Special handling for traversée folder
function getTraverseeFolderImages() {
    const folderPath = path.join(__dirname, 'images/traversée');
    console.log('Manually inspecting traversée folder:', folderPath);
    
    try {
        // List all files in directory
        const files = fs.readdirSync(folderPath);
        console.log('Files in traversée folder:', files);
        
        // Filter and sort image files
        let imageFiles = files.filter(file => {
            const extension = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension);
        });
        
        imageFiles.sort();
        
        // Convert to full paths
        return imageFiles.map(file => `images/traversée/${file}`);
    } catch (error) {
        console.error('Error reading traversée folder:', error);
        // Hardcoded images for traversée folder as fallback
        return [
            'images/traversée/61cbfbda-4f04-437d-a5c4-b191d1f80649.jpeg',
            'images/traversée/a34f9509-a80d-4886-ad36-e0a34eeacf24.jpeg',
            'images/traversée/e906b09d-02b4-4e3e-a8d8-3e6b0cc08be9.jpeg'
        ];
    }
}

// Process each directory
directories.forEach(folder => {
    const folderPath = path.join(imagesDir, folder);
    
    // Special handling for traversée folder
    if (folder === 'traversée') {
        const traverseeImages = getTraverseeFolderImages();
        imageData.folders[folder] = traverseeImages;
        imageData.firstImages[folder] = traverseeImages[0] || 'images/traversée/61cbfbda-4f04-437d-a5c4-b191d1f80649.jpeg';
        
        // Check for caption
        const captionPath = path.join(folderPath, 'caption.txt');
        if (fs.existsSync(captionPath)) {
            try {
                const captionText = fs.readFileSync(captionPath, 'utf8');
                if (!imageData.captions) {
                    imageData.captions = {};
                }
                imageData.captions[folder] = captionText;
                console.log(`Caption found for traversée`);
            } catch (error) {
                console.error(`Error reading caption for traversée:`, error);
            }
        }
        return;
    }
    
    // Get all image files in the folder
    let imageFiles = fs.readdirSync(folderPath)
        .filter(file => {
            const extension = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension);
        });
    
    // Sort the files to ensure consistent order
    imageFiles.sort();
    
    // Map to full paths
    imageFiles = imageFiles.map(file => `images/${folder}/${file}`);
    
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

// Print information about the processed data
console.log("\nSummary of processed images:");
Object.keys(imageData.folders).forEach(folder => {
    console.log(`${folder}: ${imageData.folders[folder].length} images, First: ${imageData.firstImages[folder] || 'None'}`);
}); 