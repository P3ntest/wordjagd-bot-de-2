const fs = require("fs");
const path = require("path");

const list = fs.readFileSync(__dirname + "/list.txt").toString();

let words = list.split("\n");

console.log("Words before cleaning: " + words.length);

words = words.filter(word => word.length >= 3 && word.length <= 10);

words = words.filter(word => word.toUpperCase() !== word);

console.log("Words after cleaning: " + words.length);

fs.writeFileSync(__dirname + "/cleanList.txt", words.join("\n"));