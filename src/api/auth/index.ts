import axiosClient from "api/axiosClient";
import { Auth } from "models/auth";
import { removeUser, setUser } from "services/TokenService";
import db from "db/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { v4 as uuidv4 } from "uuid";

/**
 * MOEME API
 */
export const logIn = (user: any) => {
  const url = "/00010001";
  const data = {
    userId: user.userId,
    userPassword: user.userPassword,
  };

  return axiosClient.post(url, { params: data });
};

export const changeMyChatNameApi = (dataSubmit: any) => {
  const url = "/00040033";
  const data = {
    params: dataSubmit,
  };

  return axiosClient.post(url, { params: data });
};

// Create collection profiles

const createUserProfile = (userProfile: any) =>
  db.firestore().collection("profiles").doc(userProfile.uid).set(userProfile);

const extractSnapshotData = (snapshot: any) =>
  snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

export const fetchUsers = () =>
  db.firestore().collection("profiles").get().then(extractSnapshotData);

export const getUserProfile = (uid: string) =>
  db.database().ref("users").child(uid).get();

export const login = async ({ email, password }: any) => {
  return db.auth().signInWithEmailAndPassword(email, password);
};

export const loginFirebase = async ({ email, password }: any) => {
  console.log("email", email);
  console.log("password", password);
  const { user } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  const userProfile = await getUserProfile(user.uid);
  console.log({ userProfile });
  return userProfile;
};

// export const logout = () => {
//   removeUser();
// };

export const logout = () => {
  removeUser();

  return firebase.auth().signOut();
};

export const onAuthStateChanges = (onAuth: any) => {
  return firebase.auth().onAuthStateChanged(onAuth);
};

/** Test auth 2 */
export const createUser = (userProfileRegister: any, profile: any) => {
  console.log({ userProfileRegister });
  console.log({ profile });
  const userRef = db.database().ref("users");
  setUser(profile);
  return userRef.child(userProfileRegister.user.uid).set({
    displayName: profile.displayName,
    photoURL: profile.photoURL,
    uid: profile.uid,
    id: profile.uid,
    display: profile.username,
    username: profile?.username,
    userId: profile.userId,
    email: profile.email,
    atk: profile.atk,
    avatar: "",
  });
};

export const updateProfileUser = (user) => {
  console.log("user api", user);
  const userRef = db.database().ref("users").child(user.uid);
  return userRef.update(user);
};
