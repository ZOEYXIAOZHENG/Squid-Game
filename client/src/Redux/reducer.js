import { combineReducers } from "redux";
import friendsReducer from "./characters/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsReducer,
});

export default rootReducer;
