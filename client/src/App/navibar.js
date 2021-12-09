import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navibar = () => {
    const numOfWannabes = useSelector((state) => {
        console.log(state.friendsAndWannabes);
        return (
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((fw) => !fw.accepted).length
        );
    });

    return (
        <div className="navibar">
            <li>
                <Link to="/friends">FRIENDS {numOfWannabes > 0 && "❣️"}</Link>
            </li>
            <li>
                <Link to="/chat">CHAT</Link>
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
