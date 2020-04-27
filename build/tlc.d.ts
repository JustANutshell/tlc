/// <reference types="node" />
export declare class tlc {
    private pins;
    private zustande;
    private phasen;
    private actualStateSince;
    private actualStateId;
    private cachedPinData;
    private actuInterval;
    private usePins;
    constructor(pins: {
        [key: string]: number[];
    }, zustande: {
        [key: string]: number[];
    }, phasen: {
        data: {
            [key: string]: string;
        };
        time: number;
    }[], cmdInput: NodeJS.ReadStream | null, usePins?: boolean);
    init(): Promise<void>;
    cmd(data: string): Promise<void>;
    stop(): Promise<void>;
    actu(): Promise<void>;
}
