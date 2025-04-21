const fs = require("fs");
const ProcessCommand = require("./processCommand.js");

/**
 * Main entry point for the ride sharing application.
 * Reads commands from an input file and processes them.
 */

const filename = process.argv[2];

if (!filename) {
    console.error("Error: Input filename argument is required.");
    process.exit(1);
}

const processCommand = new ProcessCommand();

fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    const inputLines = data.toString().split("\n").map(line => line.trim());

    for (const line of inputLines) {
        const parts = line.split(" ");
        const command = parts[0];
        const args = parts.slice(1);
        processCommand.process(command, args);
    }
});
