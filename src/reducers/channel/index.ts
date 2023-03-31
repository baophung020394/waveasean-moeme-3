import { Channel } from "models/channel";
import { createIsFetchingReducer } from "reducers/common";
import { combineReducers } from "redux";
import { createReducer } from "@reduxjs/toolkit";

interface initialState {
  channel?: Channel;
}

function createChannelReducer() {
  const channel = (state: initialState = null, action: any) => {
    switch (action.type) {
      case "AUTH_LOGOUT_SUCCESS":
      case "CHANNEL_FETCH_INIT_ON_ERROR":
      case "CHANNEL_FETCH_INIT":
        return {
          result: true,
          data: null,
        };
      case "CHANNEL_FETCH_SUCCESS":
        return {
          result: false,
          data: action.channel,
        };

      default:
        return state;
    }
  };

  const notificationChnl = (state: initialState = null, action: any) => {
    switch (action.type) {
      case "SET_NOTIFICATIONS":
        return action.notificationChnl;
      default:
        return state;
    }
  };

  const messages = createReducer(
    {},
    {
      CHANNELS_SET_MESSAGES: (state: any, action) => {
        const prevMessage = state[action.channelId] || [];
        state[action.channelId] = [...prevMessage, ...action.messages];
      },
    }
  );

  const messageSubs = (state = {}, action: any) => {
    switch (action.type) {
      case "CHANNELS_REGISTER_MESSAGE_SUB":
        return { ...state, [action.channelId]: action.sub };

      default:
        return state;
    }
  };

  const messageSubsNotifications = (state = {}, action: any) => {
    switch (action.type) {
      case "CHANNELS_REGISTER_MESSAGE_SUB":
        return { ...state, [action.channelId]: action.sub };

      default:
        return state;
    }
  };

  const notifications = (state = {}, action: any) => {
    switch (action.type) {
      case "GET_LIST_NOTIFICATION": {
        console.log("action.id", action);
        return action.notifications;
      }

      default:
        return state;
    }
  };

  const currentChannel = (state = {}, action: any) => {
    switch (action.type) {
      case "SET_CHANNEL_CURRENT_SUCCESS":
        return action.channel;
      default:
        return state;
    }
  };

  const filterChannels = (state = 1, action: any) => {
    switch (action.type) {
      case "FILTER_CHANNEL_SUCCESS":
        return action.number;
      default:
        return state;
    }
  };
  const filterChannelType = (state = 1, action: any) => {
    switch (action.type) {
      case "FILTER_CHANNEL_TYPE_SUCCESS":
        return action.number;
      default:
        return state;
    }
  };

  const isLoading = (state: initialState = null, action: any) => {
    switch (action.type) {
      case "LOADING_INIT":
      case "CREATE_CHANNEL_INIT":
      case "SET_CHANNEL_CURRENT_INIT":
      case "JOIN_CHANNEL_INIT":
        return {
          result: true,
        };
      case "LOADING_SUCCESS":
      case "CREATE_CHANNEL_SUCCESS":
      case "CREATE_CHANNEL_ON_ERROR":
      case "SET_CHANNEL_CURRENT_SUCCESS":
      case "JOIN_CHANNEL_SUCCESS":
      case "JOIN_CHANNEL_ON_ERROR":
        return {
          result: false,
          error: action?.error || {},
        };

      default:
        return false;
    }
  };

  return combineReducers({
    messages,
    messageSubs,
    channel,
    isLoading: isLoading,
    notificationChnl,
    currentChannel,
    messageSubsNotifications,
    notifications,
    filterChannels,
    filterChannelType
    // channelsCompare,
    // channelDetail,
    // isChecking: createIsFetchingReducer("CHANNEL_ON"),
  });
}

export default createChannelReducer();
