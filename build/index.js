"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tlc = require("./tlc");
const fs = require("fs");
const path = require("path");
let cmdInput = process.stdin;
cmdInput.setEncoding('utf-8');
let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
var test = new tlc.tlc(config.pins, {
    "re": [0],
    "ry": [0, 1],
    "gr": [2],
    "ye": [1],
}, [
    { data: { "A": "re", "B": "re" }, time: 1000 },
    { data: { "A": "ry", "B": "re" }, time: 500 },
    { data: { "A": "gr", "B": "re" }, time: 2000 },
    { data: { "A": "ye", "B": "re" }, time: 1000 },
    { data: { "A": "re", "B": "re" }, time: 1000 },
    { data: { "A": "re", "B": "ry" }, time: 500 },
    { data: { "A": "re", "B": "gr" }, time: 2000 },
    { data: { "A": "re", "B": "ye" }, time: 1000 },
], cmdInput, config.usePins);
(async function () {
    await test.init();
})();
