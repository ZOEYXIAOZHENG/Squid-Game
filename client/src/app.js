import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        //this.toggleUploader = this.toggleUploader.bind(this);
        //this.logNamePlusSomethingElse =
        //this.logNamePlusSomethingElse.bind(this);
    }

    componentDidMount() {
        console.log("App component mounted");
        //make a fetch request to get data for currently logged in user
        
        fetch("/profile.json")
        .then((data)=> data.json())
        .then((data)) => {
            console.log("data in fetch profile", data[0]);
            this.setState({
                first_name: data[0].first,
                last_name: data[0].last,
                imageUrl: data[0]["picture_url"],
                bioText: data[0].bio,

            });
      
    } 

    toggleUploader() {
        console.log("button was clicked");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    };

    // logNamePlusSomethingElse(val) {
    //     console.log(this.state.name + val);
    // }

    profileImage(val) {
        console.log("val in function", val);
        this.setState({
            imageUrl: val,
        });

        setTimeout(() => {
            this.setState({
                uploaderIsVisible: false,
            });
        }, 1000);
    }

    render() {
        return (
            <>
                <header>
                    <img
                        className="applogo"
                        id="homepage-logo"
                        src="/logo.png"
                        alt="logo"
                    />
                    <ProfilePic
                        uploader={() => this.toggleUploader()}
                        first={this.state.first_name}
                        last={this.state.last_name}
                        imageUrl={this.state.imageUrl}
                    />
                </header>
                <Profile
                    uploader={() => this.toggleUploader()}
                    first={this.state.first_name}
                    last={this.state.last_name}
                    imageUrl={this.state.picture_url}
                    bioText={this.state.bioText}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        profileImage={(val) => this.profileImage(val)}
                        uploader={() => this.toggleUploader()}
                    />
                )}
            </>
        );
    }
}
