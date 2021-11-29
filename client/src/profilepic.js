export default function ProfilePic({
    first_name,
    last_name,
    imageUrl,
    toggleModal,
}) {
    const imageUrl = picture_url || "./public/default.jpeg";
    const handleClick = () => {
        uploader();
    };

    return (
        <img
            onClick={handleClick}
            src={imageUrl}
            alt={`${first_name} ${last_name}`}
            className="profilepic"
        />
    );
}
