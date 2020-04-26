const isPi = require('detect-rpi');
const isRPI=isPi();
console.log('');
if (isRPI) {
	console.log("RUNNING ON RASPBERRY PI");
	var gpio =require('rpi-gpio');
	var gpiop=gpio.promise;
}else{
	console.log("RUNNING NOT ON RASPBERRY PI");
}
console.log('');

module.exports=class{
	constructor(pins,zustande,phasen){
		this.pins=pins;
		this.zustande=zustande;
		this.phasen=phasen;
		this.actualState={id:0,since:new Date()};
		this.cachedPinData={};

		var a=Object.keys(this.pins);
		for(var b=0;b<a.length;b++){
			for(var c=0;c<this.pins[a[b]].length;c++){
				if(isRPI){
					gpiop.setup(this.pins[a[b]][c],gpio.DIR_OUT);
				}
			}
		}

		var x=this;
		setInterval(function(){
			x.actu();
		},100);
		console.log("to stop, type 'stop'\n\n");
		standard_input.on('data',function(data_){
			let data=data_.replace(/(^[\s\n\r]*|[\s\n\r]*$)/g,"").toLowerCase();
			switch(data){
				case "stop":
					var a=Object.keys(x.pins);
					for(var b=0;b<a.length;b++){
						for(var c=0;c<x.pins[a[b]].length;c++){
							if(isRPI){
								gpiop.setup(x.pins[a[b]][c],gpio.DIR_OUT);
							}
						}
					}
					process.exit(0);
					break;
				default:
					console.log("# UNKNOWN COMMAND '"+data+"'");
					break;
			}
		});
	}
	actu(){
		var allPins={};
		if(this.actualState.since.getTime()+this.phasen[this.actualState.id].time<(new Date()).getTime()){
			this.actualState.id++;
			if(this.phasen.length<=this.actualState.id){this.actualState.id=0;console.log("--------------------------------------------------------");}
			this.actualState.since=new Date();
			console.log(this.actualState);
		}
		var a=Object.keys(this.pins);
		for(var b=0;b<a.length;b++){
			for(var c=0;c<this.pins[a[b]].length;c++){
				allPins[this.pins[a[b]][c]]=false;
			}
			var d=this.zustande[this.phasen[this.actualState.id].data[a[b]]];
			for(var e=0;e<d.length;e++){
				//setPin(this.pins[a[b]][d[e]],true);
				allPins[this.pins[a[b]][d[e]]]=true;
			}
		}
		var c="";
		var a=Object.keys(allPins);
		for(var b=0;b<a.length;b++){
			if(allPins[a[b]]!==this.cachedPinData[a[b]]){
				c=c+a[b]+":"+(allPins[a[b]]?"true ":"false")+" ";
				if(isRPI){gpiop.write(a[b],allPins[a[b]])}
				this.cachedPinData[a[b]]=allPins[a[b]];
			}
		}
		if(c!=="")console.log(c);
	}
}