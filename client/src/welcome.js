import Register from "./register"; // import在此可以理解为“导入”.

export default function Welcome() {
    return (
        <>
            <h1>Social Network</h1>
            <h3>CONNECTING CREATIVE PEOPLE</h3>
            <img src="/logo.gif" alt="logo" />
            <Register />
        </>
    );
}
