import ReactDOM from "react-dom";
import Welcome from "./Welcome/welcome.js";
import App from "./App/app.js";

import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./redux/reducer.js";
import { Provider } from "react-redux";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

fetch("/user/id")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            console.log("Cookies GET💡 then render main");
            const app = (
                <Provider store={store}>
                    <App userId={data.userId} />
                </Provider>
            );
            ReactDOM.render(app, document.querySelector("main"));
        }
    });
