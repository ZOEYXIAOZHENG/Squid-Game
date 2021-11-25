import React from "react";
import { Link } from "react-router-dom";

export default class Register extends React.Component {
    constructor(props) {
        super(props); //  ✅ 能使用 "this" 了. super(props) is a reference to the parents constructor() function.
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        fetch("/register.json", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    render() {
        return (
            <>
                <div id="register-box">
                    <h2>Join us:</h2>
                    {this.state.error && (
                        <div className="error">
                            Oops!Somenthing wrong, please try again
                        </div>
                    )}
                    <input
                        type="text"
                        name="first"
                        onChange={(e) => this.handleChange(e)}
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        name="last"
                        onChange={(e) => this.handleChange(e)}
                        placeholder="Last Name"
                    />
                    <input
                        type="email"
                        name="Email"
                        onChange={(e) => this.handleChange(e)}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => this.handleChange(e)}
                        placeholder="Password"
                    />
                    <button onClick={() => this.submit()}>submit</button>
                    <p>
                        already a member ? please{" "}
                        <Link to="/login">Log in</Link>
                    </p>
                </div>
            </>
        );
    }
}
