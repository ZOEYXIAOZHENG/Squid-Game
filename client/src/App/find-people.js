import { useState, useEffect } from "react";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // only runs once, like componentDidMount
    useEffect(() => {
        console.log("component mounted");
        fetch("/users")
            .then((res) => res.json())
            .then((results) => {
                console.log("results: ", results);
                setUsers(results);
            });
    }, []);

    useEffect(() => {
        fetch(`https://spicedworld.herokuapp.com/?q=${searchTerm}`)
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
        <div>
            <input
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {users.map((each) => (
                <div>
                    <h1 key={each.id}>
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
    );
}
