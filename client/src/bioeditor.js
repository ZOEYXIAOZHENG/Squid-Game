import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorIsVisible: false,
            bioText: this.props.bioText,
        };
    }

    uploadBio() {
        console.log("我在上传BIO！");
        fetch("/bio/upload", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                bio: this.state.bioText,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log("SUCCESS in uploading bio");
                } else {
                    console.log("ERR in uploading bio");
                }
            });
    }

    textareaToggle() {
        this.setState({
            editorIsVisible: !this.state.editorIsVisible,
        });
    }

    handleChange(e) {
        this.setState({
            bioText: e.target.value,
        });
    }

    render() {
        const { editorIsVisible, bioText } = this.state;
        return (
            <div>
                {!editorIsVisible && (
                    <div className="bio-text">
                        {bioText || this.props.bioText}
                    </div>
                )}

                {editorIsVisible && (
                    <div className="bio-edit">
                        <textarea
                            onChange={(e) => this.handleChange(e)}
                            value={bioText || this.props.bioText}
                        />
                    </div>
                )}

                <div>
                    <button
                        onClick={() => {
                            this.textareaToggle();
                            {
                                editorIsVisible && this.uploadBio();
                            }
                        }}
                    >
                        {!bioText && !editorIsVisible && "Add Bio"}
                        {bioText && !editorIsVisible && "Edit Bio"}
                        {editorIsVisible && "Save"}
                    </button>
                </div>
            </div>
        );
    }
}
