const isRPi = require('detect-rpi')();
if (isRPi) {
	var gpio = require('rpi-gpio');
	var gpiop = gpio.promise;
}
console.log("\nrunning " + (isRPi ? "" : "not ") + "on raspberrypi\n");

export class tlc{
	private pins			:{[key:string]:number[]}					;
	private zustande		:{[key:string]:number[]}					;
	private phasen			:{data:{[key:string]:string},time:number}[]	;
	private actualStateSince:Date										;
	private actualStateId	:number										=0;
	private cachedPinData	:{[key:number]:boolean}						={};
	private actuInterval	:NodeJS.Timeout								;

	constructor(pins:{[key:string]:number[]},zustande:{[key:string]:number[]},phasen:{data:{[key:string]:string},time:number}[],cmdInput:NodeJS.ReadStream|null){
		this.pins				=pins;
		this.zustande			=zustande;
		this.phasen				=phasen;
		this.actualStateSince	=new Date();

		var a=Object.keys(this.pins);
		for(var b=0;b<a.length;b++){
			for(var c=0;c<this.pins[a[b]].length;c++){
				if(isRPi){
					gpiop.setup(this.pins[a[b]][c],gpio.DIR_OUT);
				}
			}
		}

		var x=this;
		this.actuInterval=setInterval(function(){
			x.actu();
		},100);

		if(cmdInput!==null){
			console.log("to stop, type 'stop'\n\n");
			cmdInput.on('data',function(data_){
				x.cmd(String(data_).replace(/(^[\s\n\r]*|[\s\n\r]*$)/g,"").toLowerCase());
			});
		}
	}
	cmd(data:string){
		switch(data){
			case "stop":
				var a=Object.keys(this.pins);
				for(var b=0;b<a.length;b++){
					for(var c=0;c<this.pins[a[b]].length;c++){
						if(isRPi){
							gpiop.setup(this.pins[a[b]][c],gpio.DIR_OUT);
						}
					}
				}
				clearInterval(this.actuInterval);
				process.exit(0);
				break;
			default:
				console.log("# UNKNOWN COMMAND '"+data+"'");
				break;
		};
	}
	actu(){
		var pinsToSet:{[key:number]:boolean}={};
		if(this.actualStateSince.getTime()+this.phasen[this.actualStateId].time<(new Date()).getTime()){ // phase ended
			this.actualStateId++; // next phase
			if(this.phasen.length<=this.actualStateId){ // all phases ended, restarting
				this.actualStateId=0; // set to first phase
				console.log("\n--- RESTART ---\n");
			}
			this.actualStateSince=new Date(); // set new start time
			console.log("New phase:",this.actualStateId,this.actualStateSince);
		}
		var a=Object.keys(this.pins);
		for(var b=0;b<a.length;b++){ // for every traffic light
			for(var c=0;c<this.pins[a[b]].length;c++){ // for every pin
				pinsToSet[this.pins[a[b]][c]]=false;   // set low
			}
			var d=this.zustande[this.phasen[this.actualStateId].data[a[b]]]; // the active zustand for this traffic light
			for(var e=0;e<d.length;e++){
				pinsToSet[this.pins[a[b]][d[e]]]=true;
			}
		}
		var debugChangedPins="";
		var a=Object.keys(pinsToSet);
		for(var b=0;b<a.length;b++){
			let c=Number(a[b]);
			if(pinsToSet[c]!==this.cachedPinData[c]){
				debugChangedPins=debugChangedPins+a[b]+":"+(pinsToSet[c]?"true ":"false")+" ";

				if(isRPi) gpiop.write(c,pinsToSet[c]);

				this.cachedPinData[c]=pinsToSet[c];
			}
		}
		if(debugChangedPins!=="") console.log(debugChangedPins);
	}
}