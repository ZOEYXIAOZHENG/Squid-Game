import ReactDOM from "react-dom";
import Welcome from "./welcome";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            console.log("Cookies GET💡 then render main");
            ReactDOM.render(
                <img src="./assets/logo.gif" alt="logo" />,
                document.querySelector("main")
            );
        }
    });
