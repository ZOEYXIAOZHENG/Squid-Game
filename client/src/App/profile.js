import ProfilePic from "./profilepic.js";
import BioEditor from "./bioeditor.js";

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
        <>
            <div className="profile-box">
                <div className="profile-text">
                    <h1>
                        {first} {"  "} {last}
                    </h1>
                    <h2>ID:{userId}</h2>
                    <BioEditor updateBio={updateBio} bio={bio} />
                    {bio && <h2>Bio: {bio}</h2>}
                </div>
                <ProfilePic pictureUrl={pictureUrl} uploader={uploader} />
            </div>
        </>
    );
}
