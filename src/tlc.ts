const isRPi = require('detect-rpi')();
const colors = require('colors/safe');
colors.enable();
if (isRPi) {
	var gpio = require('rpi-gpio');
	var gpiop = gpio.promise;
}

console.info(
colors.red(" _____          __  __ _   ")+colors.yellow(" _    _      _   _  ")+colors.green("  ___         _           _ ")+"\n"+
colors.red("|_   _| _ __ _ / _|/ _(_)__")+colors.yellow("| |  (_)__ _| |_| |_")+colors.green(" / __|___ _ _| |_ _ _ ___| |")+"\n"+
colors.red("  | || '_/ _` |  _|  _| / _")+colors.yellow("| |__| / _` | ' \\  _|")+colors.green(" (__/ _ \\ ' \\  _| '_/ _ \\ |")+"\n"+
colors.red("  |_||_| \\__,_|_| |_| |_\\__")+colors.yellow("|____|_\\__, |_||_\\__|")+colors.green("\\___\\___/_||_\\__|_| \\___/_|")+"\n"+
colors.red("                           ")+colors.yellow("       |___/        ")+colors.green("                            "));
// http://www.patorjk.com/software/taag/#p=display&f=Small&t=TrafficLightControl

export class tlc{
	private pins			:{[key:string]:number[]}					;
	private zustande		:{[key:string]:number[]}					;
	private phasen			:{data:{[key:string]:string},time:number}[]	;
	private actualStateSince:Date										;
	private actualStateId	:number										=0;
	private cachedPinData	:{[key:number]:boolean}						={};
	private actuInterval	:NodeJS.Timeout|null						=null;
	private usePins			:boolean									=true;
	private pinNames		:string[]									;

	constructor(pins:{[key:string]:number[]},pinNames:string[],zustande:{[key:string]:number[]},phasen:{data:{[key:string]:string},time:number}[],cmdInput:NodeJS.ReadStream|null,usePins:boolean=true){
		this.pins				=pins;
		this.zustande			=zustande;
		this.phasen				=phasen;
		this.actualStateSince	=new Date();
		this.usePins			=usePins;
		this.pinNames			=pinNames;

		console.log("");
		if(this.usePins&&isRPi){
			console.log("This is an raspberry pi, pins will be used");
		}else if(this.usePins&&!isRPi){
			console.log("This is not an raspberry pi, pins CANT be used");
		}else if(!this.usePins&&isRPi){
			console.log("This is an raspberry pi, pins could be used, but were disabled");
		}else{
			console.log("This is not an raspberry pi, pins can't and won't be used");
		}
		let x=this;
		if(cmdInput!==null){
			console.log("to stop, type 'stop'\n");
			cmdInput.on('data',function(data_){
				x.cmd(String(data_).replace(/(^[\s\n\r]*|[\s\n\r]*$)/g,"").toLowerCase());
			});
		}
	}
	async init(){
		let a=Object.keys(this.pins);
		for(let b=0;b<a.length;b++){
			for(let c=0;c<this.pins[a[b]].length;c++){
				if(isRPi&&this.usePins){
					await gpiop.setup(this.pins[a[b]][c],gpio.DIR_OUT);
				}
			}
		}
		let x=this;
		this.actuInterval=setInterval(function(){
			x.actu();
		},100);
	}
	async cmd(data:string){
		switch(data){
			case "stop":
				await this.stop();
				process.exit(0);
				break;
			case "pause":
				if(this.actuInterval===null){
					let x=this;
					this.actuInterval=setInterval(function(){
						x.actu();
					},100);
				}else{
					clearInterval(this.actuInterval);
					this.actuInterval=null;
				}
				break;
			default:
				console.log("# UNKNOWN COMMAND '"+data+"'");
				break;
		};
	}
	async stop(){
		let a=Object.keys(this.pins);
		for(let b=0;b<a.length;b++){
			for(let c=0;c<this.pins[a[b]].length;c++){
				if(isRPi&&this.usePins){
					await gpiop.destroy(this.pins[a[b]][c]);
				}
			}
		}
		if(this.actuInterval!==null){clearInterval(this.actuInterval);this.actuInterval=null;};
	}
	async actu(){
		let pinsToSet:{[key:number]:boolean}={};
		if(this.actualStateSince.getTime()+this.phasen[this.actualStateId].time<(new Date()).getTime()){ // phase ended
			this.actualStateId++; // next phase
			if(this.phasen.length<=this.actualStateId){ // all phases ended, restarting
				this.actualStateId=0; // set to first phase
				console.log("\n--- RESTART ---\n");
			}
			this.actualStateSince=new Date(); // set new start time
			console.log("New phase:",this.actualStateId,this.actualStateSince);
		}


		let debugChangedPins="";
		let anythingChanged=false;
		let a=Object.keys(this.pins);
		for(let b=0;b<a.length;b++){ // for every traffic light
			debugChangedPins=debugChangedPins+a[b]+":";
			let thisPinsStatus:boolean[]=[];
			for(let c=0;c<this.pins[a[b]].length;c++){ // for every pin
				thisPinsStatus[c]=false;   // set low
			}
			let d=this.zustande[this.phasen[this.actualStateId].data[a[b]]]; // the active zustand for this traffic light
			for(let e=0;e<d.length;e++){
				thisPinsStatus[d[e]]=true;
			}

			for(let c=0;c<this.pins[a[b]].length;c++){ // for every pin
				let d=thisPinsStatus[c]?"true ":"false";
				if(thisPinsStatus[c]!==this.cachedPinData[this.pins[a[b]][c]]){
					d=colors.brightRed(d);
					if(isRPi&&this.usePins) await gpiop.write(this.pins[a[b]][c],thisPinsStatus[c]);
					this.cachedPinData[this.pins[a[b]][c]]=thisPinsStatus[c];
					anythingChanged=true;
				}
				debugChangedPins=debugChangedPins+" "+this.pinNames[c]+"("+this.pins[a[b]][c]+"):"+d;
			}
			debugChangedPins=debugChangedPins+" | ";
		}
		if(debugChangedPins!==""&&anythingChanged) console.log(debugChangedPins);
	}
}