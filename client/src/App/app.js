import { Component } from "react";
import { Link } from "react-router-dom";
import { ProfilePic } from "./profilepic.js";
import { BrowserRouter, Route } from "react-router-dom";
import Uploader from "./uploader.js";
import Profile from "./profile.js";
import FindPeople from "./find-people.js";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
            profile: true,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.profileImage = this.profileImage.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        console.log("App component mounted");
        //make a fetch request to get data for currently logged in user
        fetch("/user")
            .then((res) => res.json())
            .then((data) => {
                console.log("data in fetch profile", data[0]);
                this.setState(data);
                console.log("this.state in app:", this.state);
            });
    }

    toggleUploader() {
        console.log("button was clicked");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    profileImage(picture_url) {
        this.setState({ picture_url });

        setTimeout(() => {
            this.setState({
                uploaderIsVisible: false,
            });
        }, 1000);
    }

    updateBio({ bio }) {
        // console.log("bio in parent", bio)
        this.setState({ bio });
        // console.log("parent --> this.state after updateBio -->", this.state);
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    {this.state.uploaderIsVisible && (
                        <uploaderIsVisible
                            toggleUploader={this.toggleUploader}
                            profileImage={this.profileImage}
                        />
                    )}

                    <header>
                        <img className="applogo" src="./logo.jpeg" alt="logo" />
                        <ProfilePic
                            uploader={() => this.toggleUploader()}
                            first_name={this.state.first_name}
                            last_name={this.state.last_name}
                            picture_url={this.state.picture_url}
                        />
                    </header>

                    <Route path="/users">
                        <FindPeople />
                    </Route>

                    <Route exact path="/">
                        {this.state.profile && (
                            <Profile
                                updateBio={this.updateBio}
                                uploader={() => this.toggleUploader()}
                                first_name={this.state.first_name}
                                last_name={this.state.last_name}
                                picture_url={this.state.picture_url}
                                bio={this.state.bio}
                            />
                        )}
                    </Route>

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            profileImage={(val) => this.profileImage(val)}
                            uploader={() => this.toggleUploader()}
                        />
                    )}
                </BrowserRouter>
            </>
        );
    }
}
