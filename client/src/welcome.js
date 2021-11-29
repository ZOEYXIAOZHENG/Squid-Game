import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import ResetPassword from "./reset";

export default function Welcome() {
    return (
        <div id="welcome">
            <div id="title"></div>
            <h1>Social Network</h1>
            <h3>CONNECTING CREATIVE PEOPLE</h3>

            <img className="logo" src="/logo.gif" alt="logo" />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
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
