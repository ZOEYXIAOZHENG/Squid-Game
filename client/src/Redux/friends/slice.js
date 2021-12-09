export default function friendsReducer(friendsAndWannabes = null, action) {
    if (action.type == "friends/receivedFriendsAndWannabes") {
        friendsAndWannabes = action.payload.friendsAndWannabes;
    }
    if (action.type == "friends/requestAccepted") {
        friendsAndWannabes = friendsAndWannabes.map((person) => {
            if (person.id != action.payload.id) {
                return person;
            } else {
                return {
                    ...person,
                    accepted: true,
                };
            }
        });
    }
    if (action.type == "friends/unfriend") {
        friendsAndWannabes = friendsAndWannabes.filter(
            (person) => person.id !== action.payload.id
        );
        console.log(friendsAndWannabes);
    }
    return friendsAndWannabes;
}

export function receiveFriendsAndWannabes(friendsAndWannabes) {
    return {
        type: "friends/receivedFriendsAndWannabes",
        payload: { friendsAndWannabes },
    };
}

export function acceptFriendRequest(id) {
    return {
        type: "friends/requestAccepted",
        payload: { id },
    };
}

export function unfriend(id) {
    return {
        type: "friends/unfriend",
        payload: { id },
    };
}
