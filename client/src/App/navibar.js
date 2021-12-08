import { Link } from "react-router-dom";
const Navibar = () => {
    return (
        <div className="navibar">
            <li>
                <Link to="/friends">FRIENDS</Link>
            </li>
            <li>
                <Link to="/chat"> CHAT</Link>
            </li>
            <li>
                <Link to="/users">FIND PEOPLE</Link>
            </li>
            <li>
                <Link to="/"> MY DATA</Link>
            </li>
            <li>
                <a href="/logout">LOGOUT</a>
            </li>
            <li>
                <Link to="/delete">DELETE</Link>
            </li>
        </div>
    );
};
export default Navibar;
