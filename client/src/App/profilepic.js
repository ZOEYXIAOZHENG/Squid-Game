export default function ProfilePic({
    first_name,
    last_name,
    pictureUrl,
    uploader,
    className,
}) {
    pictureUrl = pictureUrl || "./default.jpeg";

    return (
        <div>
            <img
                onClick={uploader}
                src={pictureUrl}
                alt={`${first_name} ${last_name}`}
                className="profilepic"
            />
        </div>
    );
}
