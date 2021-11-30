import ReactDOM from "react-dom";
import Welcome from "./Welcome/welcome.js";
import App from "./App/app.js";

fetch("/user/id")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            console.log("Cookies GET💡 then render main");
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    });
