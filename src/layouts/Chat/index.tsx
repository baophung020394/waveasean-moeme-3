import {
  sendChannelMessage2,
  setDetailChannel as actionSetDetailChannel,
  uploadFiles,
} from "actions/channel";
import { setDetailChannel } from "api/channel";
import axios from "axios";
import ChannelList from "components/ChannelList";
import ChatBar from "components/ChatBar";
import ChatMessageList from "components/ChatMessageList";
import ChatOptions from "components/ChatOptions";
import Messanger from "components/Messanger";
import TypingChat from "components/TypingChat";
import { CONSTANT_MESSAGE_SOCKET } from "constants/messages-socket";
import firebase from "db/firestore";
import { useWebSocketHook } from "hooks/useWebsocket";
import { withBaseLayout } from "layouts/Base";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

interface ChatProps {
  tokenNotification: string;
}

function Chat({ tokenNotification }: ChatProps) {
  const { id }: any = useParams();
  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });
  const dispatch: any = useDispatch();
  const [progressBar, setProgressBar] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<any>({});
  const userRedux = useSelector(({ auth }) => auth.user);
  const userJoinedRef = firebase.database().ref("channels");
  const messageRef = firebase.database().ref("messages");
  const [messagesState, setMessagesState] = useState([]);
  const [searchTermState, setSearchTermState] = useState("");
  const [joinedUsersState, setJoinedUsersState] = useState<any>([]);
  const currentChannel = useSelector(({ channel }) => channel?.currentChannel);
  const isLoading = useSelector(({ channel }) => channel?.isLoading);
  const history = useHistory();

  const { loginSocket, sendJsonMessage, lastJsonMessage }: any =
    useWebSocketHook();
  // console.log("lastJsonMessage message rev", lastJsonMessage);
  let myuuid = uuidv4();

  const sendMessages = useCallback(
    (message) => {
      console.log("message", message);
      // dispatch(sendChannelMessage2(message, id));
      sendJsonMessage({
        ptCommand: CONSTANT_MESSAGE_SOCKET.PTCOMMAND_SEND_MESSAGE,
        ptGroup: CONSTANT_MESSAGE_SOCKET.PTGROUP_MESSAGE,
        ptDevice: "web",
        params: {
          chatId: message?.idMessage,
          messageType: message?.type,
          userName: "bao map",
          message: message?.content,
          userId: message?.user.userId,
          roomId: id,
          chatType: "0",
        },
      });
    },
    [id]
  );

  /**
   * Check status and edit progress bar upload
   * @param statusProgress
   */
  const perCentUploadSuccess = (statusProgress: any) => {
    if (
      statusProgress?.percent <= 100 &&
      statusProgress?.status === "Uploading"
    ) {
      setProgressBar(statusProgress);
    } else if (
      statusProgress?.percent >= 100 &&
      statusProgress?.status === "Done"
    ) {
      setMessagesState(
        messagesState
          ?.filter((_) => _?.idMessage !== statusProgress?.idMessage)
          .map((x) =>
            x?.idMessage === statusProgress?.idMessage
              ? { ...x, files: statusProgress?.url, status: "Done" }
              : x
          )
      );
    }
  };

  /**
   * Upload image
   * @param data
   */
  const uploadImage = async (data: any) => {
    console.log("data", data);
    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("type", "1");
    formData.append("file", data?.file);
    const response: any = await axios.post(
      "http://moa.aveapp.com:21405/file/api/fileupload_proc.jsp",
      formData,
      config
    );
    console.log("response", response);
    sendJsonMessage({
      ptCommand: CONSTANT_MESSAGE_SOCKET.PTCOMMAND_SEND_MESSAGE,
      ptGroup: CONSTANT_MESSAGE_SOCKET.PTGROUP_MESSAGE,
      ptDevice: "web",
      params: {
        attachment: JSON.stringify(response?.data),
        chatId: data?.idMessage,
        messageType: response?.data.type === "image" ? "2" : "3",
        userName: data?.user.userName,
        message: "",
        userId: data?.user.userId,
        roomId: id,
        chatType: "0",
      },
    });
    setSelectedFile(data);
  };

  const searchTermChange = (searchTerm: any) => {
    setSearchTermState(searchTerm);
  };

  const filterMessageBySearchTerm = () => {
    // const regex = "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/";
    // const regex = new RegExp(searchTermState, "gi");
    const messages = messagesState.filter(
      (message) =>
        message.content.toLowerCase().includes(searchTermState.toLowerCase()) ||
        message.author.username
          .toLowerCase()
          .includes(searchTermState.toLowerCase())
    );
    // const messages = messagesState.reduce((acc, message) => {
    //   console.log("messsge reduce", message);
    //   if (
    //     (message.content && message.content?.match(regex)) ||
    //     message.author.username?.match(regex)
    //   ) {
    //     acc.push(message);
    //   }
    //   return acc;
    // }, []);

    return messages;
  };

  /**
   * Check user no exists in channel and redirect to screen join channel
   */
  const checkUserInChannel = async () => {
    const response: any = await setDetailChannel(user?.userId, id);
    console.log("response", response);
    if (response?.users && response?.users.length > 0) {
      console.log("chua co");
      return history.push(`/request-join/${id}`);
    }
  };

  const handleInitListMessages = () => {
    sendJsonMessage({
      ptCommand: CONSTANT_MESSAGE_SOCKET.PTCOMMAND_REQUEST_LIST_MESSAGE,
      ptGroup: CONSTANT_MESSAGE_SOCKET.PTGROUP_MESSAGE,
      ptDevice: "web",
      params: {
        mode: "3",
        lastcid: "0",
        covl: 10,
        userId: user?.userId,
        roomId: id,
      },
    });
  };

  const clearMessageStateRoom = (message: any) => {
    console.log("message nhan dc", message);
    setMessagesState(message);
  };

  useEffect(() => {
    if (id) {
      setMessagesState([]);
      checkUserInChannel();
      dispatch(actionSetDetailChannel(user?.userId, id));
    }
  }, [id]);

  useEffect(() => {
    if (loginSocket?.userId) {
      handleInitListMessages();
    }
  }, [loginSocket, id]);

  useEffect(() => {
    if (lastJsonMessage) {
      switch (lastJsonMessage?.ptCommand) {
        case CONSTANT_MESSAGE_SOCKET.PTCOMMAND_REQUEST_LIST_MESSAGE:
          const cloneParams = lastJsonMessage?.params.map((m: any) => {
            return { ...m, roomId: lastJsonMessage?.roomId };
          });
          setMessagesState(cloneParams);
          break;
        case CONSTANT_MESSAGE_SOCKET.PTCOMMAND_LIST_MESSAGE:
          if (
            lastJsonMessage?.messageType === 55 &&
            lastJsonMessage?.chatType === 4
          ) {
            setMessagesState([lastJsonMessage]);
          } else {
            const cloneMessage = { ...lastJsonMessage };
            cloneMessage.ownerId = lastJsonMessage.senderId;
            setMessagesState((prevMessage) => {
              const updateState = [...prevMessage];
              updateState.push(cloneMessage);
              return updateState;
            });
          }
          break;

        default:
          break;
      }
    }
  }, [lastJsonMessage]);

  // console.log("currentChannel", currentChannel);
  return (
    <ChatStyled className="chat--view">
      <div className="chat--view__channels">
        <ChannelList id={id} />
      </div>
      {currentChannel && (
        <div className="chat--view__content">
          <ChatBar
            channel={currentChannel?.params}
            searchTermChange={searchTermChange}
          />

          <div className="chat--view__content__chat">
            <ChatMessageList
              selectedFile={selectedFile}
              progressBar={progressBar}
              uploadFileProp={uploadImage}
              sendJsonMessage={sendJsonMessage}
              messages={
                messagesState
                // searchTermState ? filterMessageBySearchTerm() : messagesState
              }
            />

            {id && <TypingChat user={userRedux} id={id} />}

            <div className="chat--view__content__options">
              <ChatOptions
                roomId={id}
                submitStock={sendMessages}
                sendJsonMessage={sendJsonMessage}
              />
            </div>

            <Messanger
              joinedUsersState={joinedUsersState}
              messages={messagesState}
              onSubmit={sendMessages}
              channel={currentChannel}
              uploadFileProp={uploadImage}
            />
          </div>
        </div>
      )}
    </ChatStyled>
  );
}

const ChatStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .chat--view {
    &__channels {
      width: 33%;
      max-width: 420px;
      border-right: 1px solid #e6ecf3;
    }

    &__content {
      height: 100%;
      width: 100%;
      padding-bottom: 56px;

      &__chat {
        height: calc(100% - 61px);
        display: flex;
        flex-direction: column;
      }

      &__options {
        flex: 1 1 55px;
      }
    }
  }
`;

export default withBaseLayout(Chat);
