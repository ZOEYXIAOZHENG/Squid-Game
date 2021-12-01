export default function ProfilePic({
    first_name,
    last_name,
    picture_url,
    toggleUploader,
}) {
    picture_url = picture_url || "./default.jpeg";

    return (
        <div>
            <img
                onClick={toggleUploader}
                src={picture_url}
                alt={`${first_name} ${last_name}`}
                className="profilepic"
            />
        </div>
    );
}
