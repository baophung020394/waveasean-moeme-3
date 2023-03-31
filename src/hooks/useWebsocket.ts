import { CONSTANT_CHANNEL_SOCKET } from "constants/channel-socket";
import { CONSTANT_AUTH_SOCKET } from "constants/auth-socket";
import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useDispatch } from "react-redux";
import { getChannelList } from "actions/channel";

export const useWebSocketHook = () => {
  const [loginSocket, setLoginSocket] = useState<any>();
  const [channelsState, setChannelsState] = useState<any>([]);

  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("_user"));
  });

  const [profile] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });

  const dispatch: any = useDispatch();

  /**
   * On Listen Websocket
   */
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
    "wss://moeme-web-dev.aveapp.com",
    {
      onOpen: () => console.log("opened"),
      onMessage: (data) => {
        // console.log("readyState", readyState);
        // console.log("data ne", JSON.parse(data.data));
        const message = JSON.parse(data.data);
        switch (message?.ptCommand) {
          case 65543:
            // console.log("registed");
            setLoginSocket(message?.params);
            break;
          case 262145:
            // console.log("list message", message);
            dispatch(getChannelList(message?.params))
            // setChannelsState(message?.params);

            break;
          case 262146:
            break;
          case 327682:
            // console.log('messages send', message)
            break;
          case 327686:
            // console.log('messages recv', message)
            break;
        }
      },
      shouldReconnect: (closeEvent) => true,
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  console.log("connectionStatus", connectionStatus);

  const handleRegisterWebSocket = () => {
    sendJsonMessage({
      ptCommand: CONSTANT_AUTH_SOCKET.PTCOMMAND_REGISTRATION,
      ptGroup: CONSTANT_AUTH_SOCKET.PTGROUP_AUTH,
      ptDevice: "web",
      params: {
        atk: user?.accessToken,
      },
    });
  };

  useEffect(() => {
    handleRegisterWebSocket();
  }, []);

  return {
    loginSocket,
    sendJsonMessage,
    lastJsonMessage,
  };
};
