import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editor: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.uploadBio = this.uploadBio.bind(this);
    }

    textareaToggle() {
        this.setState({
            editor: !this.state.editor,
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    uploadBio() {
        console.log("我在上传BIO！");
        fetch("/bioedit", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((res) => res.json())
            .then((bio) => {
                this.props.updateBio(bio);
            });
    }

    render() {
        return (
            <div>
                {this.state.editor && (
                    <textarea
                        defaultValue={this.props.bio}
                        name="draftBio"
                        onChange={this.handleChange}
                    />
                )}

                {!this.state.editor && (
                    <button onClick={() => this.textareaToggle()}>
                        {this.props.bio ? "Edit" : "Add"}
                    </button>
                )}

                {this.state.editor && (
                    <button
                        onClick={() => {
                            this.updateBio();
                            this.textareaToggle();
                        }}
                    >
                        Save
                    </button>
                )}
            </div>
        );
    }
}
