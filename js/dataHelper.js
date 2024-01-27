// utils/dataHelper.js
const jsonfile = require('jsonfile');

const dataFilePath = 'data.json';

// Function to read data from JSON file
function readData() {
  try {
    return jsonfile.readFileSync(dataFilePath);
  } catch (error) {
    return [];
  }
}

// Function to write data to JSON file
function writeData(data) {
  try {
    jsonfile.writeFileSync(dataFilePath, data, { spaces: 2 });
  } catch (error) {
    console.error('Error writing to data file:', error);
  }
}

module.exports = { readData, writeData };
