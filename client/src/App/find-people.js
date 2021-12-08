import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        console.log("💛FindPeople component mounted!!");
        fetch(`/users.json`, { method: "GET" })
            .then((response) => response.json())
            .then((results) => {
                console.log("results: ", results);
                setUsers(results);
            });
    }, []);

    useEffect(() => {
        if (searchTerm) {
            fetch(`/user-search/${searchTerm}.json`)
                .then((response) => response.json())
                .then((results) => {
                    setUsers(results);
                });
        } else {
            return;
        }
    }, [searchTerm]);

    return (
        <>
            <div id="find-ppl-container"></div>
            <div id="find-ppl-base"></div>

            <div className="search-ppl">
                <div id="search-box">
                    <h3>Are you looking for someone in particular?</h3>
                    <input
                        type="text"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {users.map((each) => (
                        <div key={each.id} className="person-list">
                            <Link to={`/user/${each.id}`}>
                                <h4>
                                    {each.first_name} {each.last_name}
                                </h4>
                                <img
                                    className="find"
                                    src={each.picture_url}
                                    alt={`${each.first_name} ${each.last_name}`}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
                <div id="show-box">
                    <h3>New joined players:</h3>
                </div>
            </div>
        </>
    );
}
