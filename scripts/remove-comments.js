import fs from "fs";
import path from "path";

/**
 * Remove comments from a JavaScript/JSX file
 * @param {string} filePath - Path to the file
 */
function removeComments(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Remove single-line comments (// ...)
    content = content.replace(/\/\/[^\n]*/g, "");

    // Remove multi-line comments (/* ... */)
    content = content.replace(/\/\*[\s\S]*?\*\//g, "");

    // Remove JSX comments ({/* ... */})
    content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "");

    // Clean up multiple empty lines (more than 2 consecutive)
    content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

    // Write back to file
    fs.writeFileSync(filePath, content, "utf8");

    console.log(`✅ Comments removed from: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error.message);
  }
}

// Get file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node remove-comments.js <file-path>");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

removeComments(filePath);
