// import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Register from "./register.js";
import Login from "./login.js";
import ResetPassword from "./reset.js";
import Enter from "./enter.js";

export default function Welcome() {
    return (
        <div className="welcome">
            <img className="logo" src="/2.jpeg" alt="logo" />
            <div className="base"></div>
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Enter />
                    </Route>
                    <Route exact path="/register">
                        <Register />
                    </Route>

                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/reset-password">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
