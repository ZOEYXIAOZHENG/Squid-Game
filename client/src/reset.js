import React from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    render() {
        return (
            <>
                <h4>
                    Please enter your email address below and we will send you
                    the reset instructions
                </h4>

                {this.state.error && (
                    <div className="error">
                        Oops!Somenthing wrong, please try again
                    </div>
                )}
                <label> * E-mail Address:</label>
                <input
                    type="email"
                    name="Email"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Email"
                />
                
                <button onClick={() => this.submit()}>Submit</button>
                <Link to="/login">Abort</Link>
                
            </>
        );
    }
}

