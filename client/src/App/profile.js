import ProfilePic from "./profilepic.js";
import BioEditor from "./bioeditor.js";

export default function Profile({
    first_name,
    last_name,
    picture_url,
    bio,
    updateBio,
}) {
    return (
        <div className="profile-box">
            <h1>
                {first_name} {"  "} {last_name}
            </h1>
            <BioEditor updateBio={updateBio} bio={bio} />
            {bio && <h1>Bio: {bio}</h1>}
            <ProfilePic imageUrl={picture_url} />
        </div>
    );
}
