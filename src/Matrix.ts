export class MatrixClient {
    private syncToken?: string;
    public onMatrixMessage?: (event: any, roomId: string) => void;

    constructor(private opts: { url: string, accessToken: string }) {

    }

    private async request(endpoint: string, method: string, body?: any) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${this.opts.accessToken}`);
        const res = await fetch(`${this.opts.url}/_matrix/client/r0${endpoint}`, {
            method,
            headers,
            body,
        });
        return res.json();
    }

    public async start() {
        const sync = () => setTimeout(async () => {
            try {
                await this.doSync();
                sync();
            } catch (ex) {
                console.log("Failed to sync");
            }
        }, 0);
        sync();
    }

    private async doSync() {
        console.log("Syncing");
        let params: string[] = [
            "timeout=30000",
        ];
        if (this.syncToken) {
            params.push(`since=${encodeURIComponent(this.syncToken)}`);
        }
        const res = await this.request(`/sync?${params.join("&")}`, "GET");
        this.syncToken = res.next_batch;
        console.log(res.rooms);
        for (const roomId of Object.keys(res.rooms.join) || []) {
            const room = res.rooms.join[roomId];
            for (const event of room.timeline.events) {
                if (this.onMatrixMessage) this.onMatrixMessage(event, roomId);
            }
        }
        console.log("Updating sync token ->", this.syncToken);
        // Try to fish out any new messages
    }

    public async getRoomName(roomId: string) {
        const res = await this.request(`/rooms/${encodeURIComponent(roomId)}/state/m.room.name`, "GET");
        return res.name;
    }
}