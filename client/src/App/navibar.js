import React from "react";
import { Link } from "react-router-dom";
const Navibar = () => {
    return (
        <div className="navibar">
            <li>
                <Link to="/friends">FRIENDS</Link>
            </li>
            <li>
                <Link to="/users">FIND PEOPLE</Link>
            </li>
            <li>
                <Link to="/"> MY DATA</Link>
            </li>
            <li>
                <Link to="/logout">LOGOUT</Link>
            </li>
        </div>
    );
};
export default Navibar;
