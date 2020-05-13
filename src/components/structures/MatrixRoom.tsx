import * as React from "react";
import { Container, Row, Col } from "reactstrap";
import { MatrixClient } from "../../Matrix";

interface IProps {
    roomId: string;
    client: MatrixClient;
}

interface IState {
    roomName?: string;
    messages: any[];
}

const RENDERABLE = [
    "m.room.message",
    "m.room.member",
];

export default class MatrixRoom extends React.Component<IProps, IState> { 
    constructor(props: IProps) {
        super(props);
        this.state = {
            messages: [],
        };
        this.props.client.onMatrixMessage = (mxEvent, roomId) => {
            if (roomId === this.props.roomId) {
                this.setState({
                    messages: this.state.messages.concat([mxEvent]),
                });
            }
        }
    }

    public async componentWillMount() {
        const roomName = await this.props.client.getRoomName(this.props.roomId);
        this.setState({
            roomName,
        });
    }

    public renderMessage(evt) {
        if (!RENDERABLE.includes(evt.type)) {
            return null;
        }
        let sender = evt.sender;
        let body = evt.content.body || evt.type;
        return <li key={evt.eventId}>
            <strong>{sender}</strong><span>{body}</span>
        </li>
    }

    public render() {
        return <Container fluid={true}>
            <Row>
                <Col><h1>{this.state.roomName || this.props.roomId}</h1></Col>
            </Row>
            <Row>
                <Col xs="9">
                    <ul className="messageList">
                        { this.state.messages.map((evt) => this.renderMessage(evt)).filter((n) => n !== null)}
                    </ul>
                </Col>
                <Col xs="3">Memberlist</Col>
            </Row>
        </Container>
    }
}