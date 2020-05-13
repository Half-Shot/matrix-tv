import * as React from "react";
import { Alert } from "reactstrap";
import { device } from "../../device";
import MatrixRoom from "./MatrixRoom";
import { MatrixClient } from "../../Matrix";

interface IProps {

}

interface IState {
    error?: string;
    roomId?: string;
    client: MatrixClient;
}

export default class Main extends React.Component<IProps, IState> { 

    constructor() {
        super({});
        this.state = {
            client: new MatrixClient({
            }),
            roomId: "!uXDCzlYgCTHtiWCkEx:jki.re",
        };
    }

    public async componentWillMount() {
        try {
            // Init abstraction layer
            await device.init();
            this.state.client.start();
        } catch (ex) {
            this.setState({error :`Device failed to load: ${ex} ${ex.message}`});
        }
    }

    public render() {
        let error = this.state.error ? <Alert color="danger">
            <strong> App failed to start</strong>
            <hr/>
            <pre className="errorText"> { this.state.error } </pre>
        </Alert> : null;
        let syncing = !error && !this.state.roomId ? <Alert color="info">
            Syncing
        </Alert> : null;
        let room = this.state.roomId && !this.state.error ? <MatrixRoom client={this.state.client} roomId={this.state.roomId}>
            </MatrixRoom> : null;
        return <main>
            {error}
            {syncing}
            {room}
        </main>
    }
}