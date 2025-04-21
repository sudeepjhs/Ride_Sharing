const fs = require("fs");
const ProcessCommand = require("./processCommand.js");

const filename = process.argv[2];
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
