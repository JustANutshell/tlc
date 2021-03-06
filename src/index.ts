import * as tlc from "./tlc";
import * as fs from 'fs';
import * as path from 'path';
(async function(){

	let cmdInput = process.stdin;
	cmdInput.setEncoding('utf-8');

	let config=JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

	let test = new tlc.tlc(config.pins,[
		"red","yellow","green"
	],{ // Zustäde
		"re": [0],    // red
		"ry": [0, 1], // red & yellow
		"gr": [2],    // green
		"ye": [1],    // yellow
	}, [ // ampelphasen
		{ data: { "A": "re", "B": "re" }, time: 1000 },
		{ data: { "A": "ry", "B": "re" }, time:  500 },
		{ data: { "A": "gr", "B": "re" }, time: 2000 },
		{ data: { "A": "ye", "B": "re" }, time: 1000 },
		{ data: { "A": "re", "B": "re" }, time: 1000 },
		{ data: { "A": "re", "B": "ry" }, time:  500 },
		{ data: { "A": "re", "B": "gr" }, time: 2000 },
		{ data: { "A": "re", "B": "ye" }, time: 1000 },
	], cmdInput, config.usePins);
	await test.init();

})().catch(function(e){console.log(e);process.exit(1);});