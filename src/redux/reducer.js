import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice"; 

const rootReducer = combineReducers({
  teatimetelugu_admin: userReducer,
});

export default rootReducer;
