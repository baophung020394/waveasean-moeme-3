import ProgressBars from "components/common/ProgressBars";
import Stocks from "components/Stocks";
import { useWebSocketHook } from "hooks/useWebsocket";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { Button, Icon, Image, Modal } from "semantic-ui-react";
import { styled } from "utils/styled-component";

interface ItemMessageProps {
  messages: any;
  message: any;
  type?: any;
  index?: number;
  selectedFile?: any;
  progressBar?: any;
  imageLoaded?: () => void;
  sendJsonMessage?: (data: any) => void;
}

function ItemMessage({
  messages,
  message,
  type,
  selectedFile,
  index,
  progressBar,
  imageLoaded,
  sendJsonMessage,
}: ItemMessageProps) {
  const [profile] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });

  const isAuthorOf = useCallback(
    (message: any) => {
      return message?.ownerId === profile?.userId ? "chat-right" : "chat-left";
    },
    [messages]
  );

  const renderClassName = (message: any) => {
    if (message?.messageType === "12") {
      return "chat-stocks";
    } else if (message?.messageType === "3") {
      return "chat-files";
    } else if (message?.messageType === "2") {
      return "chat-images";
    } else if (message?.messageType === "0") {
      return "chat-channel";
    } else if (
      ["55", "53"].includes(String(message?.messageType)) &&
      ["3", "4"].includes(String(message?.chatType))
    ) {
      return "chat-user-entered";
    }
  };

  const renderContentFiles = () => {
    if (message?.messageType === "3") {
      console.log("message viddeo", message);
      console.log("message viddeo", JSON.parse(message?.attachment));
      return (
        <>
          {/* {selectedFile?.timestamp === message?.timestamp &&
            message.status === "Uploading" && (
              <>
                <ProgressBars progressBar={progressBar} />;
              </>
            )} */}

          <div className="chat-file">
            <a download target="_blank" href={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=1&serverfile=${JSON.parse(message?.attachment).save_file}`}>
              <Icon name="download" />
            </a>
            <div className="chat-file__infor">
              <h4>(file){JSON.parse(message?.attachment).org_file}</h4>
              <p>
                Out of date:~
                {moment(JSON.parse(message?.attachment).end_date).format(
                  "DD/MM"
                )}
              </p>
              <span>Size:{JSON.parse(message?.attachment).file_size}</span>
            </div>
          </div>
        </>
      );
    } else if (message?.messageType === "2") {
      return (
        <>
          <img
            className="image-chat"
            src={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=1&serverfile=${
              JSON.parse(message?.attachment).thumb_file
            }`}
            alt="Thumb"
            onLoad={imageLoaded}
          />
          {selectedFile?.timestamp === message?.timestamp &&
            message.status === "Uploading" && (
              <ProgressBars progressBar={progressBar} />
            )}
        </>
      );
    } else if (message?.messageType === "12") {
      return (
        <div className="chat-text-wrapper">
          <Stocks stocks={message?.stocks} />
        </div>
      );
    }
    // else if (message?.type === 2) {
    //   return (
    //     <div className="chat-text-wrapper">
    //       <ChannelTalkDetail message={message} />
    //     </div>
    //   );
    // }
    else if (message?.messageType === "0" && message?.chatType === "0") {
      return message.message;
    }
  };

  return (
    <ItemMessageStyled>
      <li
        className={`${isAuthorOf(message)} ${renderClassName(message)}`}
        key={`${message?.id}-${index}`}
      >
        {["53"].includes(String(message?.messageType)) &&
          ["3"].includes(String(message?.chatType)) && (
            <div>
              {JSON.parse(message.attachment)?.user[0].userName} entered
            </div>
          )}

        {["55"].includes(String(message?.messageType)) &&
          ["4"].includes(String(message?.chatType)) && (
            <div>{message?.message}</div>
          )}

        {["55"].includes(String(message?.messageType)) &&
          ["5"].includes(String(message?.chatType)) && (
            <div>
              {JSON.parse(message.attachment)?.user[0].userName} entered
            </div>
          )}

        {!["53", "55"].includes(String(message?.messageType)) && (
          <>
            <div className="chat-avatar">
              <Image
                className="channel-image icon24 avatar"
                avatar
                src={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${message?.ownerId}&roomid=${message?.roomId}`}
              />
              <div className="chat-name">
                {message?.ownerId}
                <div className="chat-hour">
                  {message?.reg_date
                    ? moment(message.reg_date).zone("+05:00").format("LT")
                    : moment(message.regDate).zone("+05:00").format("LT")}
                </div>
              </div>
            </div>
            <div className="chat-text-wrapper">
              <div className="chat-menu-more">
                <Icon name="pencil alternate" size="small" color="black" />
                <ul className="chat-menu-list">
                  <li>...</li>
                </ul>
              </div>
              {renderContentFiles()}
            </div>
          </>
        )}
      </li>
    </ItemMessageStyled>
  );
}

const ItemMessageStyled = styled.div`
  .chat-channel {
    // .chat-text-wrapper {
    //   position: relative;
    //   max-width: 320px;
    //   padding: 5px 12px;
    //   background-color: #fff !important;
    //   border-top-right-radius: 12px;
    //   border-top-left-radius: 0;
    //   border-bottom-left-radius: 12px;
    //   border-bottom-right-radius: 12px;
    // }

    &.chat-right,
    &.chat-left {
      &:hover {
        .chat-menu-more {
          display: flex;
        }
      }
    }
  }

  .chat-left,
  .chat-right {
    &:hover {
      .chat-menu-more {
        display: flex;
      }
    }
    &.chat-user-entered {
      font-size: 14px;
      justify-content: center;
      color: #a9a9a9;
    }
  }

  .chat-menu-more {
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 1;
    display: none;
    background: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px;

    &:hover {
      .chat-menu-list {
        display: block;
      }
    }

    i {
      margin: 0;
    }

    .chat-menu-list {
      position: absolute;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px;
      top: 21px;
      z-index: 1;
      right: 2px;
      width: auto;
      background: #fff;
      color: #000;
      word-break: normal;
      list-style: none;
      padding: 5px 10px;
      border-radius: 4px;
      display: none;
    }
  }

  li.chat-left {
    .chat-text-wrapper {
      position: relative;
      max-width: 320px;
      padding: 5px 12px;
      background-color: #fff;
      border-top-right-radius: 12px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }

    &.chat-files {
      .chat-file {
        display: flex;

        a {
          width: 100%;
          max-width: 80px;
          min-width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #000
        }

        &__infor {
          h4 {
            font-weight: bold;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 129px;
          }
          p {
            font-weight: bold;
            font-size: 14px;
          }
          span {
            display: block;
            font-size: 12px;
            color: #cacaca;
          }
        }
      }
    }
  }

  li.chat-right {
    &.chat-images {
      .chat-text-wrapper {
        background-color: #fff;
        padding: 0;
      }
    }

    & > .chat-text-wrapper {
      background-color: #7869ef;
      color: #fff;
      border-top-right-radius: 12px;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 0;
    }

    &.chat-files {
      .chat-file {
        display: flex;

        a {
          width: 100%;
          max-width: 80px;
          min-width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
        }

        &__infor {
          h4 {
            font-weight: bold;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 129px;
          }
          p {
            font-weight: bold;
            font-size: 14px;
          }
          span {
            display: block;
            font-size: 12px;
            color: #cacaca;
          }
        }
      }
    }
  }
`;

export default ItemMessage;
