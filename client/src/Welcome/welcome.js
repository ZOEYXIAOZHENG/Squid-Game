import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Register from "./register.js";
import Login from "./login.js";
import ResetPassword from "./reset.js";

export default function Welcome() {
    return (
        <div id="welcome">
            
            <h1>Squid Game</h1>

            <img className="logo" src="/logo.jpeg" alt="logo" />
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
