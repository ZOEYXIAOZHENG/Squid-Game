import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <h1 onClick={() => this.props.loggerFunc("!!!!!!")}>
                Uploader component
            </h1>
        );
    }
}
