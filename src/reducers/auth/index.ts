import {
  createErrorReducer,
  createIsFetchingReducer,
  logoutReducer,
} from "reducers/common";
import { combineReducers } from "redux";

const createLoginReducer = () =>
  combineReducers({
    isChecking: createIsFetchingReducer("AUTH_LOGIN"),
    error: createErrorReducer("AUTH_LOGIN"),
  });

const createRegisterReducer = () =>
  combineReducers({
    isChecking: createIsFetchingReducer("AUTH_REGISTER"),
    error: createErrorReducer("AUTH_REGISTER"),
  });

const updateUserProfile = () =>
  combineReducers({
    isChecking: createIsFetchingReducer("AUTH_UPDATE_PROFILE"),
    error: createErrorReducer("AUTH_UPDATE_PROFILE"),
  });

function createAuthReducer() {
  const user = (state: any = null, action: any) => {
    switch (action.type) {
      case "AUTH_ON_ERROR":
      case "AUTH_ON_INIT":
        return null;
      case "AUTH_UPDATE_PROFILE_SUCCESS":
      case "AUTH_LOGIN_FIREBASE_SUCCESS":
      case "AUTH_LOGIN_SUCCESS":
      case "AUTH_REGISTER_SUCCESS":
      case "AUTH_ON_SUCCESS":
        return action.user;
      default:
        return state;
    }
  };

  const logout = (state: any = null, action: any) => {
    switch (action.type) {
      case "AUTH_LOGOUT_SUCCESS":
        return {
          user: null,
        };
      default:
        return state;
    }
  };

  const token = (state = null, action: any) => {
    switch (action.type) {
      case "SET_TOKEN_SUCCESS":
        const token = localStorage.getItem("token");
        return token;
      case "SET_TOKEN_NULL":
        localStorage.removeItem("token")
        return null;
      default:
        return state;
    }
  };

  return combineReducers({
    user,
    logout,
    isChecking: createIsFetchingReducer("AUTH_ON"),
    login: createLoginReducer(),
    register: createRegisterReducer(),
    update: updateUserProfile(),
    token,
  });
}

export default createAuthReducer();
