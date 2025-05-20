const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');

const PORT = 3000;

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create HTTP server
http.createServer((req, res) => {
  // Parse URL
  const parsedUrl = url.parse(req.url);
  
  // Special handling for image-data.json
  if (parsedUrl.pathname === '/image-data.json') {
    console.log('Received request for image-data.json - regenerating...');
    exec('node generate-image-data.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error regenerating image-data.json: ${error.message}`);
        res.statusCode = 500;
        res.end('Error regenerating image data');
        return;
      }
      
      console.log('Image data regenerated:', stdout);
      
      // Now serve the freshly generated file
      fs.readFile(path.join(__dirname, 'image-data.json'), (err, data) => {
        if (err) {
          console.error(`Error reading regenerated file: ${err.message}`);
          res.statusCode = 500;
          res.end('Error reading regenerated data');
          return;
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.end(data);
      });
    });
    return;
  }
  
  let pathname = path.join(__dirname, parsedUrl.pathname);
  
  // Default to index.html if path is '/'
  if (pathname === path.join(__dirname, '/')) {
    pathname = path.join(__dirname, '/index.html');
  }
  
  // Get the file extension
  const ext = path.extname(pathname);
  
  // Check if file exists
  fs.exists(pathname, (exists) => {
    if (!exists) {
      // Return 404 if file not found
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    
    // Read file
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error reading file: ${err.message}`);
        return;
      }
      
      // Set Content-Type header
      const mimeType = mimeTypes[ext] || 'text/plain';
      res.setHeader('Content-Type', mimeType);
      
      // Disable caching for all requests
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // Send the file data to client
      res.end(data);
    });
  });
}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);
console.log(`Visit http://localhost:${PORT}/ in your browser to view the website`); 