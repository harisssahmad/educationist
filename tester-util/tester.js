const fs = require("fs");
const axios = require("axios");
const csv = require("csv-parser");

const inputFileName = process.argv[2]; // Get the JSON file name as a command line argument

if (!inputFileName) {
    console.error("Please provide the JSON file name as an argument.");
    process.exit(1);
}

const outputFileName = `${inputFileName}-results.csv`;
let okCount = 0;
let totalFilesChecked = 0;

// Empty the existing CSV file if it exists
if (fs.existsSync(outputFileName)) {
    fs.writeFileSync(outputFileName, "");
}

// Read JSON file
fs.readFile(inputFileName, "utf8", async (err, data) => {
    if (err) {
        console.error(`Error reading JSON file: ${err.message}`);
        process.exit(1);
    }

    const jsonData = JSON.parse(data);
    const requests = [];

    // Process each entry in JSON data
    for (const entry of jsonData.papers) {
        totalFilesChecked++;
        const { link, text } = entry;

        // Check if the 'link' property exists
        if (!link) {
            console.error(`Link is missing for entry with text: ${text}`);
            continue;
        }

        // Send HTTP request
        const request = axios
            .head(link, { timeout: 10000 })
            .then((response) => {
                // Check if content-type is "application/pdf"
                const contentType = response.headers["content-type"];
                const status =
                    contentType === "application/pdf" ? "OK" : "NOT-OK";

                // Update counters
                if (status === "OK") {
                    okCount++;
                } else {
                    // Write to CSV
                    fs.appendFileSync(outputFileName, `"${text}","${link}"\n`);
                }
            })
            .catch((error) => {
                // Write to CSV
                fs.appendFileSync(outputFileName, `"${text}","${link}"\n`);

                if (axios.isCancel(error)) {
                    console.error(`Request canceled for ${text}`);
                } else if (error.code === "ECONNRESET") {
                    console.error(`Connection reset while checking ${text}`);
                } else {
                    console.error(`Error checking ${text}: ${error.message}`);
                }
            });

        requests.push(request);
    }

    // Wait for all requests to complete
    await Promise.all(requests);

    // Write to CSV
    fs.appendFileSync(
        outputFileName,
        `"Total files checked","${totalFilesChecked}"\n`
    );
    fs.appendFileSync(outputFileName, `"OK responses","${okCount}"\n`);
    fs.appendFileSync(
        outputFileName,
        `"NOT-OK responses","${totalFilesChecked - okCount}"\n`
    );

    // Log results
    console.log(`Total files checked: ${totalFilesChecked}`);
    console.log(`OK responses: ${okCount}`);
    console.log(`NOT-OK responses: ${totalFilesChecked - okCount}`);
});
