export default function Delete() {
    return (
        <>
            <div className="delete">
                <h1>Do you really want to delete your account?</h1>
                <a className="yes-btn" href="/delete">
                    YES</a>
                <a className="no-btn" href="/">
                    NO</a>
            </div>
        </>
    );
}
