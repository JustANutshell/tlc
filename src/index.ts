import * as tlc from "./tlc";
import * as fs from 'fs';
import * as path from 'path';
(async function(){

	let cmdInput = process.stdin;
	cmdInput.setEncoding('utf-8');

	let a=await Promise.all([
		new Promise(function(resolve,reject){
			fs.readFile(path.join(__dirname, '../asciiArt.txt'), 'utf8',function(error,data){
				if(error!==null) reject(error);
				console.log(data);
				resolve();
				// http://www.patorjk.com/software/taag/#p=display&f=Small&t=TrafficLightControl
			});
		}),
		new Promise(function(resolve,reject){
			fs.readFile(path.join(__dirname, '../config.json'), 'utf8',function(error,data){
				if(error!==null) reject(error);
				resolve(JSON.parse(data));
			});
		}),
	]);
	let config=Object(a[1]);

	let test = new tlc.tlc(config.pins, { // Zustäde
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