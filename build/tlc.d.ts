/// <reference types="node" />
export declare class tlc {
    private pins;
    private zustande;
    private phasen;
    private actualStateSince;
    private actualStateId;
    private cachedPinData;
    private actuInterval;
    constructor(pins: {
        [key: string]: number[];
    }, zustande: {
        [key: string]: number[];
    }, phasen: {
        data: {
            [key: string]: string;
        };
        time: number;
    }[], cmdInput: NodeJS.ReadStream | null);
    cmd(data: string): void;
    actu(): void;
}
