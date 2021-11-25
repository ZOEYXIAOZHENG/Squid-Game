import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.logNamePlusSomethingElse =
            this.logNamePlusSomethingElse.bind(this);
    }

    componentDidMount() {
        console.log("App component mounted");
        //make a fetch request to get data for currently logged in user
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    logNamePlusSomethingElse(val) {
        console.log(this.state.name + val);
    }

    render() {
        return (
            <>
                <header>
                    <img id="homepage-logo" src="" alt="" />
                    <ProfilePic first="" last="" imageUrl="" />
                </header>
                <button onClick={this.toggleUploader}>Toggle uploader</button>
                {this.state.uploaderIsVisible && <Uploader loggerFunc={this.logNamePlusSomethingElse} />}
            </>
        );
    }
}
