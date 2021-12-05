import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {}; // avoid copying props into state! This is a common mistake.this.setFile = this.setFile.bind(this);
        this.setFile = this.setFile.bind(this);
        this.upload = this.upload.bind(this);
    }

    setFile(e) {
        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("setFile state --> ", this.state)
        );
    }
    upload() {
        console.log(this.state.file);
        console.log("upload state -->", this.state);
        const formData = new FormData();
        formData.append("file", this.state.file);

        fetch("/profile/upload", {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                return res.json();
            })
            .then((resp) => {
                if (resp.picture_url) {
                    this.setState(resp, () =>
                        console.log("state after:", this.state)
                    );
                }
                this.props.updateProfileImage(resp.picture_url);
            })
            .catch((err) => {
                console.log("ERR in fetching pictures from server:", err);
            });
    }

    render() {
        return (
            <>
                <div className="uploader-box">
                    <h2 onClick={this.props.toggleUploader}>
                        Would you like to update your picture?
                    </h2>
                    <input
                        name="file"
                        type="file"
                        accept="image/*"
                        onChange={this.setFile}
                    />
                    <button onClick={this.upload}>Update</button>
                    <img src="./hint.png" />
                    <div
                        onClick={this.props.toggleUploader}
                        className="close"
                    ></div>
                </div>
            </>
        );
    }
}
