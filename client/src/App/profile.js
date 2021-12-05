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
                    <h1>ID:{userId}</h1>
                    <BioEditor updateBio={updateBio} bio={bio} />
                    {bio && <h1>Bio: {bio}</h1>}
                </div>
                <ProfilePic pictureUrl={pictureUrl} uploader={uploader} />
            </div>
            <div className="link">
                <Link to="/users">find people</Link>
            </div>
        </div>
    );
}
