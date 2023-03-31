import * as api from "api/channel";
import db from "db/firestore";

export const getChannelList = (channel: any) => (dispatch: any) => {
  // dispatch({
  //   type: "CHANNEL_FETCH_INIT",
  // });
  dispatch({
    type: "CHANNEL_FETCH_SUCCESS",
    channel,
  });
  // return api
  //   .getListChannel(userId)
  //   .then((channel) => {
  //     return dispatch({
  //       type: "CHANNEL_FETCH_SUCCESS",
  //       channel,
  //     });
  //   })
  //   .catch((error) => dispatch({ type: "CHANNEL_FETCH_SUCCESS_ON_ERROR", error }));
};

export const setDetailChannel = (userId: string, roomId: string) => (dispatch: any) => {
  dispatch({
    type: "SET_CHANNEL_CURRENT_INIT"
  });
  return api
    .setDetailChannel(userId, roomId)
    .then((channel) => {
      return dispatch({
        type: "SET_CHANNEL_CURRENT_SUCCESS",
        channel,
      });
    })
    .catch((error) => dispatch({ type: "SET_CHANNEL_CURRENT_ON_ERROR", error }));
};

export const joinedChannel = (dataSubmit: any) => (dispatch: any) => {
  dispatch({
    type: "JOIN_CHANNEL_INIT"
  })
  return api
    .joinedChannel(dataSubmit)
    .then((channel) => {
      return dispatch({
        type: "JOIN_CHANNEL_SUCCESS",
        channel,
      });
    })
    .catch((error) => dispatch({ type: "JOIN_CHANNEL_ON_ERROR", error }));
};

export const addChannel = (dataSubmit: any) => (dispatch: any) => {
  dispatch({
    type: "CREATE_CHANNEL_INIT"
  })
  return api
    .addChannel(dataSubmit)
    .then((channel) => {
      return dispatch({
        type: "CREATE_CHANNEL_SUCCESS",
        channel,
      });
    })
    .catch((error) => dispatch({ type: "CREATE_CHANNEL_INIT_ON_ERROR", error }));
};



export const fetchUnreads = () => async (dispatch: any, getState: any) => {
  const { user } = getState().auth;
  return api
    .fetchUnreads()
    .then((_) => dispatch({ type: "UNREAD_FETCH_SUCCESS", unreads: _, user }));
};

export const fetchChannels = () => async (dispatch: any, getState: any) => {
  const { user } = getState().auth;

  dispatch({ type: "CHANNELS_FETCH_INIT" });
  const channels: any = await api.fetchChannels();
  channels?.forEach(
    (channel: any) =>
      (channel.joinedUsers = channel?.joinedUsers?.map((user: any) => user.id))
  );

  const sortedChannels = channels?.reduce(
    (accuChannels: any, channel: any) => {
      if (user) {
        accuChannels[
          channel?.joinedUsers.includes(user && user.uid)
            ? "joined"
            : "available"
        ].push(channel);
      }
      return accuChannels;
    },
    { joined: [], available: [] }
  );

  dispatch({
    type: "CHANNELS_FETCH_SUCCESS",
    ...sortedChannels,
  });
  dispatch({ type: "SUBSRIBED_CHANGE_TO_CHANNELS" });

  return sortedChannels;
};

export const fetchChannelsCompare = () => async (dispatch: any) => {
  const channelsCompare: any = await api.fetchChannels();
  dispatch({ type: "CHANNELS_COMPARE_FETCH_SUCCESS", channelsCompare });
  return channelsCompare;
};

export const subscribeToChannel = (channelId: string) => (dispatch: any) =>
  api.subscribeToChannel(channelId, async (channel: any) => {
    const joinedUsers = await Promise.all(
      channel?.joinedUsers.map(async (userRef: any) => {
        const userSnapshot = await userRef.get();
        return userSnapshot.data();
      })
    );

    channel.joinedUsers = joinedUsers;
    dispatch({ type: "CHANNELS_SET_ACTIVE_CHANNEL", channel });
  });

export const joinChannel =
  (channel: any, user: any) => (dispatch: any, getState: any) => {
    return api.joinChannel(user, channel?.id).then((channelId) => {
      dispatch({ type: "CHANNELS_JOIN_SUCCESS" });
    });
  };

export const subscribeToProfile =
  (uid: string, channelId: string) => (dispatch: any) =>
    api.subscribeToProfile(uid, (user: any) => {
      dispatch({ type: "CHANNELS_UPDATE_USER_STATE", user, channelId });
    });

export const createChannel =
  (formData: any, userId: any) => async (dispatch: any) => {
    const newChannel = { ...formData };
    console.log({ formData });
    return dispatch(createChannel2(newChannel));
  };

export const registerChannelsJoinedSubscription = (channelSub: any) => ({
  type: "CHANNELS_REGISTER_JOINED_SUB",
  sub: channelSub,
});

export const subscribeToMessages =
  (channelId: string) => (dispatch: any, getState: any) => {
    return api.subscribeToMessages(channelId, async (changes: any) => {
      const messages = changes.map((change: any) => {
        if (change.type === "added") {
          return { id: change.doc.id, ...change.doc.data() };
        }
      });

      const messageWithAuthor = [];
      const cache: any = {};

      for await (let message of messages) {
        if (message && cache[message?.author.id]) {
          message.author = cache[message.author.id];
        } else {
          const userSnapshot = await message?.author.get();
          cache[userSnapshot?.id] = userSnapshot?.data();
          message.author = cache[userSnapshot?.id];
        }
        messageWithAuthor.push(message);
      }

      return dispatch({ type: "CHANNELS_SET_MESSAGES", messages, channelId });
    });
  };

export const subscribeNotificationToMessages =
  (channelId: string, currentChannelId: string, notificationsChnl: any) =>
  (dispatch: any) => {
    return api.subscribeNotificationToMessages(
      channelId,
      async (changes: any, snapShotSize: any) => {
        const messages = changes.map(async (change: any) => {
          // console.log('change.type',change.type)
          if (change.type === "added") {
            let lastTotal = 0;

            let index = notificationsChnl.findIndex((notification: any) => {
              // console.log("channelId", channelId);
              // console.log("notification.id", notification.id);
              return notification.id === channelId;
            });

            // console.log("index", index);
            if (index !== -1) {
              if (channelId !== currentChannelId) {
                lastTotal = notificationsChnl[index].total;

                if (snapShotSize.size - lastTotal > 0) {
                  notificationsChnl[index].count =
                    snapShotSize.size - lastTotal;
                }
              }
              notificationsChnl[index].lastKnownTotal = snapShotSize.size;
              // console.log('notificationsChnl', notificationsChnl)
            } else {
              notificationsChnl.push({
                id: channelId,
                total: snapShotSize.size,
                lastKnownTotal: snapShotSize.size,
                count: 0,
              });
            }
          }
        });
        // console.log("updateNotifications 2", notificationsChnl);
        // return dispatch(updateUnreadMess(notificationsChnl));
      }
    );
  };

export const updateUnreadMess = (notifications: any) => (dispatch: any) => {
  return api.updateUnreadMess(notifications).then(() => {
    dispatch({ type: "UPDATED_NOTIFICATIONS" });
  });
};

export const clearNotifications =
  (notifications: any, channelId: string) => (dispatch: any) => {
    let index = notifications?.findIndex(
      (notification: any) => notification.id === channelId
    );

    if (index !== -1) {
      let updateNotifications = [...notifications];
      updateNotifications[index].total = notifications[index].lastKnownTotal;
      updateNotifications[index].count = 0;
      // dispatch(updateUnreadMess(updateNotifications));
    }
  };
export const registerMessageSubscription = (
  channelId: any,
  messageSub: any
) => ({
  type: "CHANNELS_REGISTER_MESSAGE_SUB",
  sub: messageSub,
  channelId,
});

export const setCurrentChannel =
  (channel: any, isClicked: boolean) => (dispatch: any, getState: any) => {
    const { user } = getState().auth;
    const newUser = { ...user };
    newUser.id = user.uid;
    newUser.display = user.username;
    if (channel?.id && isClicked) {
      api.joinChannel(newUser, channel?.id);
    }
    return dispatch({ type: "SET_CHANNEL_CURRENT", channel });
  };

export const setNotification = (notificationChnl: any) => (dispatch: any) => {
  return dispatch({ type: "SET_NOTIFICATIONS", notificationChnl });
};

export const getNotifications =
  (channelId: string = null) =>
  (dispatch: any) =>
    api.getNotifications().then((notifications) => {
      console.log({ notifications });
      return dispatch({ type: "GET_LIST_NOTIFICATION", notifications });
    });

/** TEST new structure */

export const createChannel2 =
  (newChannel: any) => async (dispatch: any, getState: any) => {
    let cloneChannel = { ...newChannel };
    if (!cloneChannel?.owner_name) {
      cloneChannel.owner_name = cloneChannel?.room_name;
    }
    const { user } = getState().auth;
    cloneChannel.createdBy = user;

    return api
      .createChannel2(cloneChannel, user)
      .then(() => console.log("save success"))
      .catch((err) => console.log("err", err));
  };

export const sendChannelMessage2 =
  (message: any, channelId: string) => (dispatch: any, getState: any) => {
    const newMessage = { ...message };
    const { user } = getState().auth;
    delete newMessage.author;

    newMessage.channelId = channelId;
    newMessage.author = {
      username: user?.userId || user.displayName,
      id: user?.uid,
    };

    return api
      .sendChannelMessage2(newMessage, channelId)
      .then(() => console.log("save mess success"))
      .catch((err) => console.log("err", err));
  };

export const uploadFiles =
  (data: any, idChannel: string, messages: any, perCentUploadFunc: any) =>
  (dispatch: any) => {
    const storageRef = db.storage().ref();
    let newData = { ...data };
    console.log("newData file", newData);
    let perCentUpload: any;
    const filePath = `chat/files/${newData.idMessage}.${newData.metadata.type}`;

    return storageRef
      .child(filePath)
      .put(newData.files, { contentType: newData.fileType })
      .on(
        "state_changed",
        (snap) => {
          perCentUpload = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );

          perCentUploadFunc({
            percent: perCentUpload,
            status: "Uploading",
            idMessage: newData.idMessage,
            timestamp: newData.timestamp,
          });
        },
        (err) => {
          console.log("err", err);

          perCentUploadFunc({
            percent: 0,
            status: "Failed",
            idMessage: newData.idMessage,
            timestamp: newData.timestamp,
          });
        },
        () => {
          // console.log("vo day?");
          // console.log("perCentUpload success", perCentUpload);

          if (perCentUpload >= 100) {
            storageRef
              .child(filePath)
              .getDownloadURL()
              .then((url) => {
                // delete newData.statusOfUpload;
                newData.files = url;
                perCentUploadFunc({
                  percent: perCentUpload,
                  status: "Done",
                  idMessage: newData.idMessage,
                  timestamp: newData.timestamp,
                  url: url,
                });
                dispatch(sendChannelMessage2(newData, idChannel));
              })
              .catch((err) => {
                console.log("err", err);
                perCentUploadFunc({
                  percent: 100,
                  status: "Failed",
                  idMessage: newData.idMessage,
                  timestamp: newData.timestamp,
                });
              });
          }
        }
      );
  };
