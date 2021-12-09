import { Component } from "react";
import ProfilePic from "./profilepic.js";
import { BrowserRouter, Route } from "react-router-dom";
import Profile from "./profile.js";
import FindPeople from "./find-people.js";
import OtherProfile from "./otherProfile.js";
import Uploader from "./uploader.js";
import Friends from "./friends.js";
import Navibar from "./navibar";
import Chat from "./chat.js";
import Delete from "./delete.js";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: true,
            uploaderIsVisible: true,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.updateProfileImage = this.updateProfileImage.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    //only mounted once
    componentDidMount() {
        console.log("App component mounted");
        //make a fetch request to get data for currently logged in user
        fetch("/profile")
            .then((res) => res.json())
            .then((data) => {
                console.log("data in fetch profile", data[0]);
                this.setState(data);
                if (this.state.picture_url) {
                    this.setState({
                        uploaderIsVisible: !this.state.uploaderIsVisible,
                    });
                }
                console.log("this.state in app:", this.state);
            });
    }

    toggleUploader() {
        console.log("toggleUploader was clicked");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    updateProfileImage(picture_url) {
        this.setState({ picture_url });
        console.log(this.state);

        setTimeout(() => {
            this.setState({
                uploaderIsVisible: false,
            });
        }, 300);
    }

    updateBio({ bio }) {
        this.setState({ bio });
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            toggleUploader={this.toggleUploader}
                            updateProfileImage={this.updateProfileImage}
                        />
                    )}
                    <header>
                        <img
                            className="applogo"
                            src="./old_logo.jpeg"
                            alt="logo"
                        />
                        <ProfilePic
                            uploader={() => this.toggleUploader()}
                            first={this.state.first_name}
                            last={this.state.last_name}
                            pictureUrl={this.state.picture_url}
                        />
                    </header>

                    <Route>
                        <Navibar numOfWannbes={this.state.num_of_wannabes} />
                    </Route>
                    <Route path="/users">
                        <FindPeople />
                    </Route>
                    <Route path="/user/:id">
                        <OtherProfile />
                    </Route>
                    <Route path="/friends">
                        <Friends />
                    </Route>
                    <Route path="/delete">
                        <Delete />
                    </Route>

                    <Route exact path="/">
                        {this.state.profile && (
                            <Profile
                                updateBio={this.updateBio}
                                uploader={() => this.toggleUploader()}
                                first={this.state.first_name}
                                last={this.state.last_name}
                                pictureUrl={this.state.picture_url}
                                bio={this.state.bio}
                                userId={this.props.userId}
                            />
                        )}
                    </Route>
                    <Route path="/chat">
                        <Chat />
                    </Route>
                    {/* {this.state.uploaderIsVisible && (
                        <Uploader
                            profileImage={(val) => this.profileImage(val)}
                            uploader={() => this.toggleUploader()}
                        />
                    )} */}
                </BrowserRouter>
            </>
        );
    }
}
