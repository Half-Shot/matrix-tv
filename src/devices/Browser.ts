import { IDevice } from "../device";

/**
 * Abstraction layer for calling WebOS functions
 */
export class BrowserDevice implements IDevice {
    public readonly name = "browser";
    public async init() {
        
    }

    public async getTime() {
        return Date.now();
    }
}