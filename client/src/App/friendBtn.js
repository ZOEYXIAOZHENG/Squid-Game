import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function friendBtn() {
    // friendBtn should be passed the other userId via props from the otherProfile on which this btn will be rendered
    const { id: otherId } = useParams();
    // add a useEffect to make a request to the server on find out our relationship status with the user we are looking at
    const [relation, setRelation] = useState("");

    // as a result of this fetch our btn should display the correct txt
    useEffect(() => {
        fetch(`/relation/${otherId}.json`)
            .then((resp) => resp.json())
            .then((result) => {
                console.log(result);
                console.log(otherId);
                if (result.length == 0) {
                    setRelation("Make Friend Request");
                } else if (result[0].accepted) {
                    setRelation("End Friendship");
                } else if (
                    !result[0].accepted &&
                    result[0].sender_id == otherId
                ) {
                    setRelation("Accept Friend Request");
                } else if (
                    !result[0].accepted &&
                    result[0].recipient_id == otherId
                ) {
                    setRelation("Cancel Friend Request");
                } else {
                    return;
                }
            });
    }, [relation]);

    function updateRelation() {
        fetch(`/relation/${otherId}.json`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ relation }),
        })
            .then((res) => res.json())
            .then(({ relation }) => {
                setRelation(relation);
            });
    }
    return (
        <>
            <div className="add-friend">
                <button onClick={updateRelation}>{relation}</button>
            </div>
        </>
    );
}
