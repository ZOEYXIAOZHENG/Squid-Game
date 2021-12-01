import { useState, useEffect } from "react";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        console.log("💛FindPeople component mounted!!");

        fetch("/users")
            .then((response) => response.json())
            .then((results) => {
                console.log("results: ", results);
                setUsers(results);
            });
    }, [searchTerm]);

    // const updateUsersList = (e) => {
    //     if (e.key === "Enter") {
    //         setUsers([...users, e.target.value]);
    //     }
    // };

    return (
        <>
            <div className="search-ppl">
                <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {users.map((each) => (
                    <div key={each.id}>
                        <h1>
                            {each.first_name} {each.last_name}
                        </h1>
                        <img
                            className="find"
                            src={each.picture_url}
                            alt={`${each.first_name} ${each.last_name}`}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
