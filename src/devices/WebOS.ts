import { IDevice } from "../device";

const WEB_OS_LIBS = [
    "webOSTVjs-1.2.0/webOSTV.js",
    "webOSTVjs-1.2.0/webOSTV-dev.js"
];

/**
 * Abstraction layer for calling WebOS functions
 */
export class WebOSDevice implements IDevice {
    public readonly name = "WebOS";

    public async init() {
        // Import helper libraries
        import('./webOSTVjs-1.2.0/webOSTV.js');
        import('./webOSTVjs-1.2.0/webOSTV-dev.js');
    }

    private async makeServiceRequest<T>(service: string, method: string, parameters: any={}): Promise<T> {
        //sample code for calling LS2 API
        return new Promise((resolve, reject) => {
            (window as any).webOS.service.request(service,
            {
                method,
                parameters,
                onSuccess: function (args: T) {
                    resolve(args);
                },
                onFailure: function (err: Error) {
                    reject(err);
                }
            });
    
        });
    }

    public async getTime(): Promise<number> {
        return (await this.makeServiceRequest<{utc: number}>("luna://com.palm.systemservice", "clock/getTime")).utc;
    }
}