const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Simple file-based DB helper
const dbFile = (name, initial) => {
  const p = path.join(dataDir, `${name}.json`);
  
  // Initialize file with empty array or object if it doesn't exist
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(initial, null, 2));
  }
  
  return {
    read: () => {
      try {
        const data = fs.readFileSync(p, 'utf8');
        return data ? JSON.parse(data) : initial;
      } catch (e) {
        console.error(`Error reading ${name}.json:`, e);
        return initial;
      }
    },
    write: (data) => {
      try {
        fs.writeFileSync(p, JSON.stringify(data, null, 2));
      } catch (e) {
        console.error(`Error writing to ${name}.json:`, e);
        throw e;
      }
    }
  };
};

module.exports = dbFile;
