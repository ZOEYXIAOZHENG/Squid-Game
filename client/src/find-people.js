import { useState, useEffect } from "react";

export default function findPeople() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log("component mounted");
        fetch("/users")
            .then((res) => res.json())
            .then((results) => {
                setUsers(results);
            });
    }, []);

    return(
        <div>
            {users.map(each => {
                return(
                 
                    <h1 key={each.id}>{each.first_name}{each.last_name}</h1>
                <img className="default" src={each.picture_url} alt={`${each.first_name}${each.last_name}`}/>
                 
                )
            })}
        </div>
    )


    
    
}

