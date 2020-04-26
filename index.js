standard_input=process.stdin;
standard_input.setEncoding('utf-8');

var tlc=require("./tlc.js");
var test=new tlc({ // pins
	// red,yellow,green
	"A":[1,2,3],
	"B":[4,5,6],
},{ // Zustäde
	0:[0],   // red
	1:[0,1], // red & yellow
	2:[2],   // green
	3:[1],   // yellow
},[ // ampelphasen
	{data:{"A":0,"B":0},time:1000},
	{data:{"A":1,"B":0},time:500 },
	{data:{"A":2,"B":0},time:2000},
	{data:{"A":3,"B":0},time:1000},
	{data:{"A":0,"B":0},time:1000},
	{data:{"A":0,"B":1},time:500 },
	{data:{"A":0,"B":2},time:2000},
	{data:{"A":0,"B":3},time:1000},
]);