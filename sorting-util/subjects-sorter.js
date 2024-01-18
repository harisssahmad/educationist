const fs = require("fs");

// Read the JSON file
const jsonString = fs.readFileSync("../subjects.json", "utf-8");

// Parse JSON
const data = JSON.parse(jsonString);

// Sort subjects alphabetically by name
data.subjects.sort((a, b) => a.name.localeCompare(b.name));

// Print the sorted subjects
console.log(data.subjects);

// Convert the sorted data back to a JSON string
const indentation = 2;
const sortedJsonString = JSON.stringify(data, null, indentation);

// Write the sorted JSON data back to the same file
fs.writeFileSync("../subjects.json", sortedJsonString);

console.log("Sorting and writing to file complete.");
