import { combineReducers } from "redux";
import friendsReducer from "./friends/slice.js";
import chatMessagesReducer from "./messages/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsReducer,
    msgs: chatMessagesReducer,
});

export default rootReducer;
