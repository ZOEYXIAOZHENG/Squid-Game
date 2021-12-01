// import { useState, useEffect } from "react";

export default function friendBtn() {
    // friendBtn should be passed the other userId via props from the otherProfile on which this btn will be rendered
    // add a useEffect to make a request to the server on find out our relationship status with the user we are looking at
    // as a result of this fetch our btn should display the correct txt
    return (
        <>
            <div className="add-friend">
                <button>Send Teammate Rquest</button>

                <button
                    onClick={() => {
                        this.updateBio();
                        this.textareaToggle();
                    }}
                >
                    Cancel Teammate Request
                </button>
            </div>
        </>
    );
}
