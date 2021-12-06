import React from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: "start",
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    sendOTP() {
        fetch("/password/reset/start", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
            }),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                if (resp.success) {
                    this.setState({
                        stage: "OTP",
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    verify() {
        fetch("/password/reset/verify", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                newPass: this.state.newPass,
                verCode: this.state.verCode,
            }),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                if (resp.success) {
                    this.setState({
                        stage: "verified",
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    resetPassword() {
        if (this.state.stage === "start") {
            return (
                <div id="reset-box">
                    <h4>
                        Please enter your email address below and we will send
                        you the reset instruction:
                    </h4>

                    {this.state.error && (
                        <div className="error">
                            Oops!Somenthing wrong, please try again
                        </div>
                    )}

                    <input
                        type="email"
                        name="email"
                        onChange={(e) => this.handleChange(e)}
                        placeholder="Email"
                    />

                    <button onClick={() => this.sendOTP()}>Get OTP</button>
                    <Link to="/login">Abort</Link>
                </div>
            );
        } else if (this.state.stage === "OTP") {
            return (
                <div>
                    <h3>
                        An email with a verification code has been send to you
                    </h3>
                    <div>
                        <input
                            type="password"
                            name="newPass"
                            onChange={(e) => this.handleChange(e)}
                            placeholder="New Password"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="verCode"
                            onChange={(e) => this.handleChange(e)}
                            placeholder="Verification code"
                        />
                    </div>
                    <button onClick={() => this.verify()}>Submit</button>
                    <div>
                        {this.state.error && (
                            <div className="error">
                                Oops, something went wrong!
                            </div>
                        )}
                    </div>
                </div>
            );
        } else if (this.state.stage === "verified") {
            return (
                <div>
                    <h1>Password successfully updated!</h1>
                    <Link to="/login">Click here to log in</Link>
                </div>
            );
        }
    }
    render() {
        return <div>{this.resetPassword()}</div>;
    }
}
