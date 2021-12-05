import ProfilePic from "./profilepic.js";
import BioEditor from "./bioeditor.js";
import { Link } from "react-router-dom";

export default function Profile({
    first,
    last,
    pictureUrl,
    bio,
    updateBio,
    userId,
    uploader,
}) {
    return (
        <div>
            <div className="profile-box">
                <div className="profile-text">
                    <h1>
                        {first} {"  "} {last}
                    </h1>
                    <h2>ID:{userId}</h2>
                    <BioEditor updateBio={updateBio} bio={bio} />
                    {bio && <h4>Bio: {bio}</h4>}
                </div>
                <ProfilePic pictureUrl={pictureUrl} uploader={uploader} />
            </div>
            <div className="link">
                <Link to="/users">find people</Link>
            </div>
            <div className="link2">
                <Link to="/Friends">Friends</Link>
            </div>
            <a href="/logout">logout</a>
        </div>
    );
}
