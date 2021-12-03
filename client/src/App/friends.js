import { createStore, reducer } from "redux";
import { useSelector } from "react-redux";

export default function friends() {
    const friends = useSelector(state => state.friendsAndWannabes && state.friendsAndWannabes.filter(
        fw => fw.accepted
    ));
    const wannabes = useSelector{
        state => state.friendsAndWannabes && state
    }
    const q = `
    SELECT users.id, first, last, image, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND requester_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND requester_id = users.id)
    OR (accepted = true AND requester_id = $1 AND recipient_id = users.id)
`;


    return <div></div>;
};
