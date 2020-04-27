"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isRPi = require('detect-rpi')();
if (isRPi) {
    var gpio = require('rpi-gpio');
    var gpiop = gpio.promise;
}
console.log("\nrunning " + (isRPi ? "" : "not ") + "on raspberrypi\n");
var tlc = /** @class */ (function () {
    function tlc(pins, zustande, phasen, cmdInput) {
        this.actualStateId = 0;
        this.cachedPinData = {};
        this.pins = pins;
        this.zustande = zustande;
        this.phasen = phasen;
        this.actualStateSince = new Date();
        var a = Object.keys(this.pins);
        for (var b = 0; b < a.length; b++) {
            for (var c = 0; c < this.pins[a[b]].length; c++) {
                if (isRPi) {
                    gpiop.setup(this.pins[a[b]][c], gpio.DIR_OUT);
                }
            }
        }
        var x = this;
        this.actuInterval = setInterval(function () {
            x.actu();
        }, 100);
        if (cmdInput !== null) {
            console.log("to stop, type 'stop'\n\n");
            cmdInput.on('data', function (data_) {
                x.cmd(String(data_).replace(/(^[\s\n\r]*|[\s\n\r]*$)/g, "").toLowerCase());
            });
        }
    }
    tlc.prototype.cmd = function (data) {
        switch (data) {
            case "stop":
                var a = Object.keys(this.pins);
                for (var b = 0; b < a.length; b++) {
                    for (var c = 0; c < this.pins[a[b]].length; c++) {
                        if (isRPi) {
                            gpiop.setup(this.pins[a[b]][c], gpio.DIR_OUT);
                        }
                    }
                }
                clearInterval(this.actuInterval);
                process.exit(0);
                break;
            default:
                console.log("# UNKNOWN COMMAND '" + data + "'");
                break;
        }
        ;
    };
    tlc.prototype.actu = function () {
        var pinsToSet = {};
        if (this.actualStateSince.getTime() + this.phasen[this.actualStateId].time < (new Date()).getTime()) { // phase ended
            this.actualStateId++; // next phase
            if (this.phasen.length <= this.actualStateId) { // all phases ended, restarting
                this.actualStateId = 0; // set to first phase
                console.log("\n--- RESTART ---\n");
            }
            this.actualStateSince = new Date(); // set new start time
            console.log("New phase:", this.actualStateId, this.actualStateSince);
        }
        var a = Object.keys(this.pins);
        for (var b = 0; b < a.length; b++) { // for every traffic light
            for (var c = 0; c < this.pins[a[b]].length; c++) { // for every pin
                pinsToSet[this.pins[a[b]][c]] = false; // set low
            }
            var d = this.zustande[this.phasen[this.actualStateId].data[a[b]]]; // the active zustand for this traffic light
            for (var e = 0; e < d.length; e++) {
                pinsToSet[this.pins[a[b]][d[e]]] = true;
            }
        }
        var debugChangedPins = "";
        var a = Object.keys(pinsToSet);
        for (var b = 0; b < a.length; b++) {
            var c_1 = Number(a[b]);
            if (pinsToSet[c_1] !== this.cachedPinData[c_1]) {
                debugChangedPins = debugChangedPins + a[b] + ":" + (pinsToSet[c_1] ? "true " : "false") + " ";
                if (isRPi)
                    gpiop.write(c_1, pinsToSet[c_1]);
                this.cachedPinData[c_1] = pinsToSet[c_1];
            }
        }
        if (debugChangedPins !== "")
            console.log(debugChangedPins);
    };
    return tlc;
}());
exports.tlc = tlc;
