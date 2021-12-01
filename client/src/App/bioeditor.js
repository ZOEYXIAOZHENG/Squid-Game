import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editor: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.setBio = this.setBio.bind(this);
        this.textareaToggle = this.textareaToggle.bind(this);
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

    setBio() {
        console.log("我在上传BIO！");
        fetch("/bioedit.json", {
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
                        placeholder="tell us your story..."
                    />
                    // <input name="age"/>
                )}

                {!this.state.editor && (
                    <button onClick={() => this.textareaToggle()}>
                        {this.props.bio ? "Edit" : "Add"}
                    </button>
                )}

                {this.state.editor && (
                    <button
                        onClick={() => {
                            this.setBio();
                            this.textareaToggle();
                        }}
                    >
                        Save Data
                    </button>
                )}
            </div>
        );
    }
}
