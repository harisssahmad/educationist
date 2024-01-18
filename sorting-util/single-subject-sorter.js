const fs = require("fs");

function sortPapersInPlace(papers) {
    // First pass
    papers.sort((a, b) => {
        const aNumber = extractNumberAfterLastUnderscore(a.textCondensed);
        const bNumber = extractNumberAfterLastUnderscore(b.textCondensed);
        return compareNumbersWithUndefinedLast(aNumber, bNumber);
    });

    // Second pass
    papers.sort((a, b) => {
        const aOrder = getOrderAfterSecondUnderscore(a.textCondensed);
        const bOrder = getOrderAfterSecondUnderscore(b.textCondensed);
        return compareOrder(aOrder, bOrder);
    });

    // Third pass
    papers.sort((a, b) => {
        const aOrder = getOrderAfterFirstUnderscore(a.textCondensed);
        const bOrder = getOrderAfterFirstUnderscore(b.textCondensed);

        // Ensure 'w' comes before 's'
        if (aOrder === "w" && bOrder === "s") {
            return -1;
        } else if (aOrder === "s" && bOrder === "w") {
            return 1;
        }

        return aOrder.localeCompare(bOrder);
    });

    // Fourth pass (descending order)
    papers.sort((a, b) => {
        const aYear = getYearFromText(a.text);
        const bYear = getYearFromText(b.text);
        return bYear - aYear;
    });
}

function extractNumberAfterLastUnderscore(text) {
    const match = text.match(/_(\d+)$/);
    return match ? parseInt(match[1]) : undefined;
}

function compareNumbersWithUndefinedLast(a, b) {
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return 1;
    if (b === undefined) return -1;
    return a - b;
}

function getOrderAfterSecondUnderscore(text) {
    const match = text.match(/_(pm|ms|qp|in|gt)_/);
    return match ? match[1] : text;
}

function compareOrder(a, b) {
    const order = ["pm", "ms", "qp", "in", "gt"];
    return order.indexOf(a) - order.indexOf(b);
}

function getOrderAfterFirstUnderscore(text) {
    const match = text.match(/_(\w+)/);
    return match[1].charAt(0);
}

function getYearFromText(text) {
    const match = text.match(/ (\d{4})/);
    return match ? parseInt(match[1]) : 0;
}

const inputFileName = process.argv[2]; // Get the JSON file name as a command line argument

if (!inputFileName) {
    console.error("Please provide the JSON file name as an argument.");
    process.exit(1);
}

// Read JSON from file
const jsonString = fs.readFileSync(inputFileName, "utf-8");
const papers = JSON.parse(jsonString).papers;

// Sort papers in place
sortPapersInPlace(papers);

// Display the sorted papers
console.log(JSON.stringify({ papers }, null, 2));

// Write the sorted JSON data back to the same file
fs.writeFileSync(inputFileName, JSON.stringify({ papers }, null, 2));

console.log("Sorting and writing to file complete.");
