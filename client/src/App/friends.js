import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
    receiveFriendsAndWannabes,
    acceptFriendRequest,
    unfriend,
} from "../redux/friends/slice.js";

export default function Friends() {
    const dispatch = useDispatch();
    const wannabes = useSelector((state) => {
        console.log(state.friendsAndWannabes);
        return (
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((fw) => !fw.accepted)
        );
    });
    const friends = useSelector((state) => {
        return (
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((fw) => fw.accepted)
        );
    });

    useEffect(() => {
        fetch("/friends-and-wannabes")
            .then((resp) => resp.json())
            .then((friendsAndWannabes) => {
                dispatch(receiveFriendsAndWannabes(friendsAndWannabes));
            })
            .catch((err) => console.log(err));
    }, []);

    const acceptFriendReq = (id) => {
        return function () {
            fetch(`/relation/${id}.json`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ relation: "Accept Friend Request" }),
            })
                .then((resp) => resp.json())
                .then(() => dispatch(acceptFriendRequest(id)));
        };
    };

    const unfriendFriend = (id) => {
        return function () {
            fetch(`/relation/${id}.json`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ relation: "End Friendship" }),
            })
                .then((resp) => resp.json())
                .then(() => dispatch(unfriend(id)));
        };
    };

    return (
        <>
            <div className="friends-wannabes">
                <div className="wannabes">
                    <h3>There people want to be your friends</h3>
                    {wannabes &&
                        wannabes.map((each) => (
                            <div key={each.id}>
                                <Link to={`/user/${each.id}`}>
                                    <h2>
                                        {each.first_name} {each.last_name}
                                    </h2>
                                    <img
                                        className="find"
                                        src={each.picture_url}
                                        alt={`${each.first_name} ${each.last_name}`}
                                    />
                                </Link>
                                <button onClick={acceptFriendReq(each.id)}>
                                    accept
                                </button>
                            </div>
                        ))}
                </div>
                <div className="friends">
                    <h3>There people are currently your friends</h3>
                    {friends &&
                        friends.map((each) => (
                            <div key={each.id}>
                                <Link to={`/user/${each.id}`}>
                                    <h2>
                                        {each.first_name} {each.last_name}
                                    </h2>
                                    <img
                                        className="find"
                                        src={each.picture_url}
                                        alt={`${each.first_name} ${each.last_name}`}
                                    />
                                </Link>
                                <button onClick={unfriendFriend(each.id)}>
                                    unfriend
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
