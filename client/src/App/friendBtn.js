import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function friendBtn() {
    // friendBtn should be passed the other userId via props from the otherProfile on which this btn will be rendered
    const { id: otherId } = useParams();
    // add a useEffect to make a request to the server on find out our relationship status with the user we are looking at
    const [relation, setRelation] = useState("");

    // as a result of this fetch our btn should display the correct txt
    useEffect(() => {
        fetch(`/relation/${otherId}`)
            .then((res) => res.json())
            .then(({ relation }) => {
                console.log("relation:", relation);
                setRelation(relation);
            });
    }, []);

    function updateRelation() {
        fetch(`/relation/${otherId}`, {
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
