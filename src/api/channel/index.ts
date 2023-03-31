import axiosClient from "api/axiosClient";
import firebase from "firebase/compat/app";
import "firebase/database";
import db from "db/firestore";
import "firebase/compat/firestore";

export const getListChannel = (userId: string) => {
  const url = "/00040044";
  const data = {
    params: {
      userId: userId,
    },
  };

  return axiosClient.post(url, JSON.stringify(data));
};

export const setDetailChannel = (userId: string, roomId: string) => {
  const url = "/00040009";
  const data = {
    params: {
      userId: userId,
      roomId,
    },
  };

  return axiosClient.post(url, JSON.stringify(data));
};

export const addChannel = (dataSubmit:any) => {
  const url = "/00040002";
  const data = {
    params: dataSubmit,
  };

  return axiosClient.post(url, JSON.stringify(data));
};

export const joinedChannel = (dataSubmit:any) => {
  const url = "/00040014";
  const data = {
    params: dataSubmit,
  };

  return axiosClient.post(url, JSON.stringify(data));
};

const extractSnapshotData = (snapshot: any) =>
  snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

export const fetchUnreads = () =>
  db.firestore().collection("messagesunread").get().then(extractSnapshotData);

export const fetchChannels = () =>
  db.firestore().collection("channels").get().then(extractSnapshotData);

export const subscribeToChannel = (channelId: string, onSubsribe: any) =>
  db
    .firestore()
    .collection("channels")
    .doc(channelId)
    .onSnapshot((snapshot) => {
      const channel = { id: snapshot.id, ...snapshot.data() };
      onSubsribe(channel);
    });

export const subscribeToProfile = (uid: string, onSubsribe: any) =>
  db
    .firestore()
    .collection("profiles")
    .doc(uid)
    .onSnapshot((snapshot) => onSubsribe(snapshot.data()));

export const joinChannel = async (user: any, channelId: string) => {
  const channelRef = db.database().ref(`channels/${channelId}`);

  await channelRef.child("joinedUsers").child(user.uid).set(user);
};

export const updateUnreadMess = async (notifications: any) => {
  notifications.forEach((no: any) => {
    return db.firestore().collection("notifications").doc(no.id).set(no);
  });
};

export const subscribeToChannelsJoined = (onSubsribe: any) =>
  db
    .firestore()
    .collection("channels")
    .onSnapshot((snapshot: any) => onSubsribe(snapshot.docChanges()));

export const subscribeToMessages = (channelId: any, onSubsribe: any) =>
  db
    .firestore()
    .collection("channels")
    .doc(channelId)
    .collection("messages")
    .onSnapshot((snapshot) => onSubsribe(snapshot.docChanges()));

export const subscribeNotificationToMessages = (
  channelId: any,
  onSubsribe: any
) =>
  db
    .firestore()
    .collection("channels")
    .doc(channelId)
    .collection("messages")
    .onSnapshot((snapshot) => onSubsribe(snapshot.docChanges(), snapshot));

export const getNotifications = () =>
  db.firestore().collection("notifications").get().then(extractSnapshotData);

/** TEST new structure */

export const createChannel2 = (createChannel: any, user: any) => {
  const channelRef = db.database().ref("channels");
  const key = channelRef.push().key;

  let newChannel = { ...createChannel };

  newChannel.id = key;
  return channelRef.child(key).update(newChannel);
};

export const sendChannelMessage2 = (message: any, channelId: any) => {
  const messagesRef = db.database().ref("messages");
  return messagesRef.child(channelId).push().set(message);
};

export const getListPostsHome = () => {};
