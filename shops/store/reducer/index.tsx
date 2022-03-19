import user_contactReducer from './userArray';
import cart from './common';
import {combineReducers} from "redux";

const allReducers = combineReducers({
    cart
})

export default allReducers;