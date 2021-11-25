export default function ProfilePic({ first, last, imageUrl,logAgain }) {
    imageUrl = imageUrl || "default.jpeg";
    return (
        <img onClick={logAgain}
            src={imageUrl}
            alt={`${first}
                ${last}`}
            id="haha"
        />
    );
}
