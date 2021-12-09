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
        <>
            <div className="view-ppl">
                <img src={users.picture_url || "/default.jpeg"} />
                <div className="profile-text">
                    <h1>
                        {users.first_name} {users.last_name}
                    </h1>
                    {/* <h3>{users.created_at}</h3> */}
                    <h4>email: {users.email}</h4>
                    {users.bio && <p>{users.bio}</p>}
                    <FriendBtn />
                </div>
            </div>
        </>
    );
}
