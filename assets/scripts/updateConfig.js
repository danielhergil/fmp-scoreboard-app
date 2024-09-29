// updateConfig.js
const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "../config.js");
const newUrl = process.argv[2]; // Get the new URL from command line argument

if (!newUrl) {
  console.error("Please provide a new server URL.");
  process.exit(1);
}

// Read the existing config file
fs.readFile(configPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading config file:", err);
    return;
  }

  // Replace the URL in the config file
  const updatedConfig = data.replace(/SERVER_URL = ".*?"/, `SERVER_URL = "${newUrl}"`);

  // Write the updated config back to the file
  fs.writeFile(configPath, updatedConfig, "utf8", (err) => {
    if (err) {
      console.error("Error writing to config file:", err);
      return;
    }
    console.log(`Updated server URL to ${newUrl} in config.js`);
  });
});
