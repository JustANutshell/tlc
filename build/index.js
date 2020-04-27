"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tlc = require("./tlc");
var fs = require("fs");
var path = require("path");
var cmdInput = process.stdin;
cmdInput.setEncoding('utf-8');
// HIER MUSS MAN DIE PINS ÄNDERN HIER MUSS MAN DIE PINS ÄNDERN HIER MUSS MAN DIE PINS ÄNDERN HIER MUSS MAN DIE PINS ÄNDERN HIER MUSS MAN DIE PINS ÄNDERN HIER MUSS MAN DIE PINS ÄNDERN
// pinlayout gibt es hier: http://dangerousprototypes.com/blog/wp-content/media/2018/05/Raspberry-GPIO.jpg
// red,yellow,green
var config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
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
], cmdInput);
