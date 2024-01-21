const fs = require('fs');

// Function to generate a timestamp
const generateTimestamp = () => {
  return Date.now();
};

// Read the HTML file
const htmlFilePath = 'public/index.html'; // Adjust the path based on your project structure
const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

// Replace the timestamp placeholder with the generated timestamp
const updatedHtmlContent = htmlContent.replace(/timestamp=123456/g, `timestamp=${generateTimestamp()}`);

// Write the updated content back to the HTML file
fs.writeFileSync(htmlFilePath, updatedHtmlContent, 'utf-8');

console.log('Timestamp updated successfully.');
