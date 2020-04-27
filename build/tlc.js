"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        this.actuInterval = null;
        this.pins = pins;
        this.zustande = zustande;
        this.phasen = phasen;
        this.actualStateSince = new Date();
        var x = this;
        if (cmdInput !== null) {
            console.log("to stop, type 'stop'\n\n");
            cmdInput.on('data', function (data_) {
                x.cmd(String(data_).replace(/(^[\s\n\r]*|[\s\n\r]*$)/g, "").toLowerCase());
            });
        }
    }
    tlc.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var a, b, c, x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        a = Object.keys(this.pins);
                        b = 0;
                        _a.label = 1;
                    case 1:
                        if (!(b < a.length)) return [3 /*break*/, 6];
                        c = 0;
                        _a.label = 2;
                    case 2:
                        if (!(c < this.pins[a[b]].length)) return [3 /*break*/, 5];
                        if (!isRPi) return [3 /*break*/, 4];
                        return [4 /*yield*/, gpiop.setup(this.pins[a[b]][c], gpio.DIR_OUT)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        c++;
                        return [3 /*break*/, 2];
                    case 5:
                        b++;
                        return [3 /*break*/, 1];
                    case 6:
                        x = this;
                        this.actuInterval = setInterval(function () {
                            x.actu();
                        }, 100);
                        return [2 /*return*/];
                }
            });
        });
    };
    tlc.prototype.cmd = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = data;
                        switch (_a) {
                            case "stop": return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.stop()];
                    case 2:
                        _b.sent();
                        process.exit(0);
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("# UNKNOWN COMMAND '" + data + "'");
                        return [3 /*break*/, 4];
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    tlc.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var a, b, c;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        a = Object.keys(this.pins);
                        b = 0;
                        _a.label = 1;
                    case 1:
                        if (!(b < a.length)) return [3 /*break*/, 6];
                        c = 0;
                        _a.label = 2;
                    case 2:
                        if (!(c < this.pins[a[b]].length)) return [3 /*break*/, 5];
                        if (!isRPi) return [3 /*break*/, 4];
                        return [4 /*yield*/, gpiop.setup(this.pins[a[b]][c], gpio.DIR_OUT)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        c++;
                        return [3 /*break*/, 2];
                    case 5:
                        b++;
                        return [3 /*break*/, 1];
                    case 6:
                        if (this.actuInterval !== null) {
                            clearInterval(this.actuInterval);
                        }
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    tlc.prototype.actu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pinsToSet, a, b, c, d, e, debugChangedPins, a, b, c_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pinsToSet = {};
                        if (this.actualStateSince.getTime() + this.phasen[this.actualStateId].time < (new Date()).getTime()) { // phase ended
                            this.actualStateId++; // next phase
                            if (this.phasen.length <= this.actualStateId) { // all phases ended, restarting
                                this.actualStateId = 0; // set to first phase
                                console.log("\n--- RESTART ---\n");
                            }
                            this.actualStateSince = new Date(); // set new start time
                            console.log("New phase:", this.actualStateId, this.actualStateSince);
                        }
                        a = Object.keys(this.pins);
                        for (b = 0; b < a.length; b++) { // for every traffic light
                            for (c = 0; c < this.pins[a[b]].length; c++) { // for every pin
                                pinsToSet[this.pins[a[b]][c]] = false; // set low
                            }
                            d = this.zustande[this.phasen[this.actualStateId].data[a[b]]];
                            for (e = 0; e < d.length; e++) {
                                pinsToSet[this.pins[a[b]][d[e]]] = true;
                            }
                        }
                        debugChangedPins = "";
                        a = Object.keys(pinsToSet);
                        b = 0;
                        _a.label = 1;
                    case 1:
                        if (!(b < a.length)) return [3 /*break*/, 5];
                        c_1 = Number(a[b]);
                        if (!(pinsToSet[c_1] !== this.cachedPinData[c_1])) return [3 /*break*/, 4];
                        debugChangedPins = debugChangedPins + a[b] + ":" + (pinsToSet[c_1] ? "true " : "false") + " ";
                        if (!isRPi) return [3 /*break*/, 3];
                        return [4 /*yield*/, gpiop.write(c_1, pinsToSet[c_1])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.cachedPinData[c_1] = pinsToSet[c_1];
                        _a.label = 4;
                    case 4:
                        b++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (debugChangedPins !== "")
                            console.log(debugChangedPins);
                        return [2 /*return*/];
                }
            });
        });
    };
    return tlc;
}());
exports.tlc = tlc;
