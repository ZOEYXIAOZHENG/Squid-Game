import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import FriendBtn from "./friendBtn.js";

export default function OtherProfile() {
    const [users, setUsers] = useState([]);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        fetch(`/user/${id}.json`)
            .then((res) => res.json())
            .then((results) => {
                if (results.isUser) {
                    history.replace("/");
                } else {
                    setUsers(results.data[0]);
                }
            });
    }, []);

    return (
        <div className="view-ppl">
            <img src={users.picture_url || "/default.jpeg"} />
            <h3>
                {users.first} {users.last}
            </h3>
            <h2>email: {users.email}</h2>
            {users.bio && <p>{users.bio}</p>}
            <FriendBtn />
        </div>
    );
}
