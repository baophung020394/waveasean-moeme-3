import * as api from "api/auth";
import { Auth } from "models/auth";
import { setUser } from "services/TokenService";

/**
 * MOEME API
 */
export const logIn = (user: any) => (dispatch: any) => {
  dispatch({
    type: "AUTH_LOGIN_INIT",
  });
  return api.logIn(user).then((res: any) => {
    setUser(res?.params);
    localStorage.setItem("token", res?.params.atk);
    // dispatch(setToken(res?.params.atk))
    dispatch({
      type: "SET_TOKEN_SUCCESS",
    });
    return dispatch({
      type: "AUTH_LOGIN_SUCCESS",
      user: res.params,
    });
  });
};

export const changeMyChatName = (dataSubmit: any) => (dispatch: any) => {
  dispatch({
    type: "CHANGE_MY_CHAT_NAME_INIT",
  });
  return api.changeMyChatNameApi(dataSubmit).then(() => {
    return dispatch({
      type: "CHANGE_MY_CHAT_NAME_SUCCESS",
    });
  });
};

export const login = (formData: Auth) => (dispatch: any) => {
  dispatch({
    type: "AUTH_LOGIN_INIT",
  });
  return api
    .login(formData)
    .then((user) => {
      setUser(user);
      console.log("user login", user);
      return dispatch({
        type: "AUTH_LOGIN_SUCCESS",
        user,
      });
    })
    .catch((error) => {
      console.log({ error });
      dispatch({
        type: "AUTH_LOGIN_ERROR",
        error: { message: error.message },
      });
      logout();
    });
};

export const registerUser =
  (formData: any, profile: any) => (dispatch: any) => {
    return api
      .createUser(formData, profile)
      .then(() => {
        console.log("user register success");
        return dispatch({
          type: "AUTH_REGISTER_SUCCESS",
          user: profile,
        });
      })
      .catch((error) => {
        console.log("error", error);
        dispatch({ type: "AUTH_REGISTER_ERROR", error });
        logout();
      });
  };

export const logout = () => (dispatch: any) =>
  api.logout().then((_) => {
    dispatch({ type: "AUTH_LOGOUT_SUCCESS" });
  });

export const listenToAuthChanges = () => (dispatch: any) => {
  dispatch({ type: "AUTH_ON_INIT" });

  return api.onAuthStateChanges(async (authUser: any) => {
    console.log("authUser", authUser);
    // const user = JSON.parse(localStorage.getItem("_profile"));

    if (authUser) {
      const userProfile = await api.getUserProfile(authUser.uid);
      // userProfile.val();
      // console.log("authUser", authUser);
      // console.log(userProfile.val());
      dispatch({
        type: "AUTH_ON_SUCCESS",
        user: userProfile.val() === undefined ? authUser : userProfile.val(),
      });
      console.log(`we are authenticated`);
    } else {
      dispatch({ type: "AUTH_ON_ERROR" });
      console.log(`we are NOT authenticated`);
    }
  });
};

export const updateProfileUser = (user: any) => (dispatch: any) => {
  console.log("user acion", user);
  return api.updateProfileUser(user).then(() => {
    dispatch({ type: "AUTH_UPDATE_PROFILE_SUCCESS", user });
  });
};
