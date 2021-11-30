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

        fetch("/upload", {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                return res.json();
            })
            .then((picture_url) => {
                if (picture_url) {
                    this.setState(picture_url, () =>
                        console.log("state after:", this.state)
                    );
                }
                this.props.updateImgUrl(picture_url);
            })
            .catch((err) => {
                console.log("ERR in fetching pictures from server:", err);
            });
    }

    render() {
        return (
            <div className="uploader-box">
                <h1 onClick={this.props.toggleUploader}>Uploader component</h1>
                <input
                    name="file"
                    type="file"
                    accept="image/*"
                    onChange={this.setFile}
                />
                <button onClick={this.upload}>Submit</button>
            </div>
        );
    }
}
