"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isRPi = require('detect-rpi')();
const colors = require('colors/safe');
colors.enable();
if (isRPi) {
    var gpio = require('rpi-gpio');
    var gpiop = gpio.promise;
}
class tlc {
    constructor(pins, zustande, phasen, cmdInput, usePins = true) {
        this.actualStateId = 0;
        this.cachedPinData = {};
        this.actuInterval = null;
        this.usePins = true;
        this.pins = pins;
        this.zustande = zustande;
        this.phasen = phasen;
        this.actualStateSince = new Date();
        this.usePins = usePins;
        console.log("");
        if (this.usePins && isRPi) {
            console.log("This is an raspberry pi, pins will be used");
        }
        else if (this.usePins && !isRPi) {
            console.log("This is not an raspberry pi, pins CANT be used");
        }
        else if (!this.usePins && isRPi) {
            console.log("This is an raspberry pi, pins could be used, but were disabled");
        }
        else {
            console.log("This is not an raspberry pi, pins can't and won't be used");
        }
        let x = this;
        if (cmdInput !== null) {
            console.log("to stop, type 'stop'\n");
            cmdInput.on('data', function (data_) {
                x.cmd(String(data_).replace(/(^[\s\n\r]*|[\s\n\r]*$)/g, "").toLowerCase());
            });
        }
    }
    async init() {
        let a = Object.keys(this.pins);
        for (let b = 0; b < a.length; b++) {
            for (let c = 0; c < this.pins[a[b]].length; c++) {
                if (isRPi && this.usePins) {
                    await gpiop.setup(this.pins[a[b]][c], gpio.DIR_OUT);
                }
            }
        }
        let x = this;
        this.actuInterval = setInterval(function () {
            x.actu();
        }, 100);
    }
    async cmd(data) {
        switch (data) {
            case "stop":
                await this.stop();
                process.exit(0);
                break;
            case "pause":
                if (this.actuInterval === null) {
                    let x = this;
                    this.actuInterval = setInterval(function () {
                        x.actu();
                    }, 100);
                }
                else {
                    clearInterval(this.actuInterval);
                    this.actuInterval = null;
                }
                break;
            default:
                console.log("# UNKNOWN COMMAND '" + data + "'");
                break;
        }
        ;
    }
    async stop() {
        let a = Object.keys(this.pins);
        for (let b = 0; b < a.length; b++) {
            for (let c = 0; c < this.pins[a[b]].length; c++) {
                if (isRPi && this.usePins) {
                    await gpiop.destroy(this.pins[a[b]][c]);
                }
            }
        }
        if (this.actuInterval !== null) {
            clearInterval(this.actuInterval);
            this.actuInterval = null;
        }
        ;
    }
    async actu() {
        let pinsToSet = {};
        if (this.actualStateSince.getTime() + this.phasen[this.actualStateId].time < (new Date()).getTime()) { // phase ended
            this.actualStateId++; // next phase
            if (this.phasen.length <= this.actualStateId) { // all phases ended, restarting
                this.actualStateId = 0; // set to first phase
                console.log("\n--- RESTART ---\n");
            }
            this.actualStateSince = new Date(); // set new start time
            console.log("New phase:", this.actualStateId, this.actualStateSince);
        }
        let a = Object.keys(this.pins);
        for (let b = 0; b < a.length; b++) { // for every traffic light
            for (let c = 0; c < this.pins[a[b]].length; c++) { // for every pin
                pinsToSet[this.pins[a[b]][c]] = false; // set low
            }
            let d = this.zustande[this.phasen[this.actualStateId].data[a[b]]]; // the active zustand for this traffic light
            for (let e = 0; e < d.length; e++) {
                pinsToSet[this.pins[a[b]][d[e]]] = true;
            }
        }
        let debugChangedPins = "";
        let anythingChanged = false;
        a = Object.keys(pinsToSet);
        for (let b = 0; b < a.length; b++) {
            let c = Number(a[b]);
            debugChangedPins = debugChangedPins + a[b] + ":";
            if (pinsToSet[c] !== this.cachedPinData[c]) {
                anythingChanged = true;
                debugChangedPins = debugChangedPins + colors.brightRed(pinsToSet[c] ? "true " : "false");
                if (isRPi && this.usePins)
                    await gpiop.write(c, pinsToSet[c]);
                this.cachedPinData[c] = pinsToSet[c];
            }
            else {
                debugChangedPins = debugChangedPins + (pinsToSet[c] ? "true " : "false");
            }
            debugChangedPins = debugChangedPins + " ";
        }
        if (debugChangedPins !== "" && anythingChanged)
            console.log(debugChangedPins);
    }
}
exports.tlc = tlc;
