import user_contactReducer from './userArray';
import {combineReducers} from "redux";

const allReducers = combineReducers({
    user_contact: user_contactReducer,
})

export default allReducers;