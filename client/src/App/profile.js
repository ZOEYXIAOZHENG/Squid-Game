import { ProfilePic } from "./profilepic.js";
import BioEditor from "./bioeditor.js";

export default function Profile({
    first_name,
    last_name,
    picture_url,
    bio,
    updateBio,
}) {
    return (
        <>
            <div>
                <h1>User Profile Page</h1>
                <h3>
                    {first_name}
                    {last_name}
                </h3>
                <BioEditor updateBio={updateBio} bio={bio} />
                <ProfilePic imageUrl={picture_url} />
            </div>
        </>
    );
}
