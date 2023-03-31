import ProgressBars from "components/common/ProgressBars";
import Stocks from "components/Stocks";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { Image } from "semantic-ui-react";
import { styled } from "utils/styled-component";

interface ItemMessageProps {
  messages: any;
  message: any;
  type?: any;
  index?: number;
  selectedFile?: any;
  progressBar?: any;
  imageLoaded?: () => void;
}

function ItemMessage({
  messages,
  message,
  type,
  selectedFile,
  index,
  progressBar,
  imageLoaded,
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
    } else if (
      message?.messageType === "3" &&
      message?.fileType &&
      ["video/mp4", "video/mp3", "audio/mpeg"].includes(message?.fileType)
    ) {
      return "chat-videos";
    } else if (
      message?.messageType === "2" &&
      message?.fileType &&
      ["image/jpeg", "image/png", "image/jpg"].includes(message?.fileType)
    ) {
      return "chat-images";
    } else if (
      message?.messageType === "2" &&
      message?.fileType &&
      ![
        "video/mp4",
        "video/mp3",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "audio/mpeg",
      ].includes(message?.fileType)
    ) {
      return "other-file";
    } else if (message?.messageType === "0") {
      return "chat-channel";
    } else {
      return "chat-user-entered";
    }
  };

  const renderContentFiles = () => {
    if (
      message?.messageType === "3" &&
      message?.fileType &&
      ["video/mp4", "video/mp3", "audio/mpeg"].includes(message?.fileType)
    ) {
      return (
        <div className="chat-text-wrapper">
          {selectedFile?.timestamp === message?.timestamp &&
            message.status === "Uploading" && (
              <>
                <ProgressBars progressBar={progressBar} />;
              </>
            )}
          <video
            onLoad={imageLoaded}
            controls
            src={
              message?.status === "Uploading"
                ? URL.createObjectURL(message?.files)
                : message.files
            }
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (
      message?.messageType === "2" &&
      message?.fileType &&
      ["image/jpeg", "image/png", "image/jpg"].includes(message?.fileType)
    ) {
      return (
        <div className="chat-text-wrapper">
          <img
            className="image-chat"
            src={
              message?.status === "Uploading"
                ? URL.createObjectURL(message?.files)
                : message.files
            }
            alt="Thumb"
            onLoad={imageLoaded}
          />
          {selectedFile?.timestamp === message?.timestamp &&
            message.status === "Uploading" && (
              <ProgressBars progressBar={progressBar} />
            )}
        </div>
      );
    } else if (
      message?.messageType === "3" &&
      message?.fileType &&
      ![
        "video/mp4",
        "video/mp3",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "audio/mpeg",
      ].includes(message?.fileType)
    ) {
      return (
        <div className={`chat-text-wrapper `}>
          <button
            className="chat-text"
            type="submit"
            onClick={() => `${window.open(`${message.files}`)}`}
            disabled={message.status === "Uploading"}
            onLoad={imageLoaded}
          >
            {message?.metadata.name}
          </button>
          {selectedFile?.timestamp === message?.timestamp &&
            message.status === "Uploading" && (
              <ProgressBar
                animated
                now={progressBar?.percent}
                label={`${progressBar?.percent}%`}
              />
            )}
        </div>
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
    else if (message?.messageType !== "53") {
      return <div className="chat-text-wrapper">{message.message}</div>;
    }
  };

  return (
    <ItemMessageStyled>
      <li
        className={`${isAuthorOf(message)} ${renderClassName(message)}`}
        key={`${message?.id}-${index}`}
      >
        {message?.messageType === "53" && (
          <div>{JSON.parse(message.attachment)?.user[0].userName} entered</div>
        )}

        {message?.messageType !== "53" && (
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
                  ? moment(message.reg_date).zone("-07:00").format("LT")
                  : moment(message.regDate).zone("-07:00").format("LT")}
              </div>
            </div>
          </div>
        )}

        {renderContentFiles()}
      </li>
    </ItemMessageStyled>
  );
}

const ItemMessageStyled = styled.div`
  .chat-channel {
    .chat-text-wrapper {
      position: relative;
      max-width: 320px;
      padding: 5px 12px;
      background-color: #fff !important;
      border-top-right-radius: 12px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }
  .chat-left,
  .chat-right {
    &.chat-user-entered {
      font-size: 14px;
      justify-content: center;
      color: #a9a9a9;
    }
  }
`;

export default ItemMessage;
