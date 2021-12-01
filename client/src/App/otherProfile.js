import { useState, useEffect } from "react";
import ProfilePic from "./profilepic.js";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import FriendBtn from "./friendBtn.js";

export default function OtherProfile() {
    const [users, setUsers] = useState([]);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        fetch(`/user/:${id}`)
            .then((res) => res.json())
            .then((results) => {
                if (results.error) {
                    console.log("results: ", results);
                }
                setUsers(results);
            });
    }, []);

    return (
        <div className="view-ppl">
            <ProfilePic picture_url={users.picture_url} picBig="picBig" />
            <h3>
                {users.first} {users.last}
            </h3>
            {users.bio && <p>{users.bio}</p>}
            <FriendBtn />
        </div>
    );
}
