import { WebOSDevice } from "./devices/WebOS";
import { BrowserDevice } from "./devices/Browser";

export interface IDevice {
    name: string;
    init: () => Promise<void>,
    getTime: () => Promise<number>,
}

class Device {
    private readonly internalDevice: IDevice;
    constructor() {
        const userAgent = window.navigator.userAgent;
        if (userAgent.includes("Web0S")) { // Yes, not WebOS. I don't know why either.
            this.internalDevice = new WebOSDevice();
        } else {
            this.internalDevice = new BrowserDevice();
        }
    }

    public async init() {
        await this.internalDevice.init();
    }

    public getName() {
        return this.internalDevice.name;
    }
}

export const device = new Device();
