import React from "react";
import { Link } from "react-router-dom";
// import { useState } from "react";
// import useForm  from "./hooks/useForm";
// import useFormSubmit from "./hooks/useFormSubmit";

export default class Register extends React.Component {
    constructor(props) {
        super(props); //  super(props) is a reference to the parents constructor() function.
        this.state = {};
    }

    //-----------   ---- HOOKS Version ---------------------
    // const[error,setError] = useState(false);
    // const [userInput,handleChange] = useForm();
    // const [submit,error] = useFormSubmit("/register",userInput);

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        fetch("/register", {
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
                    console.log(123);
                    location.replace("/");
                } else {
                    let error_message = "";
                    if (
                        data.error &&
                        data.error.detail.includes("already exists")
                    ) {
                        error_message = "duplicate";
                    } else {
                        error_message = "error";
                    }

                    this.setState({
                        error: error_message,
                    });
                }
            });
    }

    render() {
        return (
            <>
                <div id="register-box">
                    <h2>Sign up:</h2>
                    {this.state.error === "error" && (
                        <div className="error">
                            Oops!Somenthing wrong, please try again
                        </div>
                    )}
                    {this.state.error === "duplicate" && (
                        <div className="error">
                            This email has been registered, please login
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
                        name="email"
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
