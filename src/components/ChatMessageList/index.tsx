import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import generateItems from "utils/generateItems";
import { convertFiles } from "utils/handleFiles";
import { createTimestamp } from "utils/time";
import { v4 as uuidv4 } from "uuid";
import ItemMessage from "./ItemMessage";

interface ChatMessageListProps {
  messages: any;
  progressBar?: any;
  selectedFile?: any;
  uploadFileProp?: (data: any) => void;
  sendJsonMessage?: (data: any) => void;
}

function ChatMessageList({
  messages = [],
  progressBar,
  selectedFile,
  uploadFileProp,
  sendJsonMessage,
}: ChatMessageListProps) {
  let myuuid = uuidv4();
  const [profile] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });
  let messagesRef: any = useRef<any>();
  let boxMessagesRef: any = useRef<any>();

  // console.log("messages", messages);
  // console.log("generateItems messages", generateItems(messages));

  const imageLoaded = () => {
    messagesRef.scrollIntoView();
  };

  /**
   * Handle drop files
   * @param ev
   */
  const dropHandler = (ev: any) => {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        if (!uploadFileProp) return;
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
          // let newMessage = {
          //   content: ``,
          //   files: file,
          //   idMessage: myuuid,
          //   user: user,
          //   timestamp: createTimestamp(),
          //   fileType: file.type,
          //   metadata: convertFiles(file),
          //   type: 1,
          // };
          const messages: any = {
            idMessage: myuuid,
            content: "",
            user: profile,
            type: 2,
            image: file,
          };

          uploadFileProp(messages);
          boxMessagesRef.current.style.border = "unset";
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
        boxMessagesRef.current.style.border = "unset";
      });
    }
  };

  /**
   * Handle when hover element drop files
   * @param ev
   */
  const dragOverHandler = (ev: any) => {
    console.log("File(s) in drop zone");
    boxMessagesRef.current.style.border = "3px dashed rgb(29 78 216)";
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  /**
   * Handle when leave drag element
   * @param ev
   */
  const dragLeaveHandler = (ev: any) => {
    boxMessagesRef.current.style.border = "unset";
    ev.preventDefault();
  };

  useEffect(() => {
    messagesRef?.scrollIntoView();
  }, [messages]);

  return (
    <ChatMessageListStyled
      className="chat--container"
      onDrop={dropHandler}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      ref={boxMessagesRef}
    >
      <ul ref={messagesRef} className="chat-box chatContainerScroll">
        {messages?.length > 0 &&
          generateItems(messages).map((message: any, idx: number) => {
            if (message?.type === "day") {
              let convertDate = moment(
                message?.id[0]?.reg_date
                  ? message?.id[0]?.reg_date
                  : message?.id[0]?.regDate
              )
                .zone("+05:00")
                .calendar();
              return (
                <div className="chat-date" key={`${message?.id}-${idx}`}>
                  <h1>{convertDate}</h1>
                  {/* <h1>
                    {moment(message?.date.split(" ")[1]).zone("+05:00").isAfter(7)
                      ? moment(message?.date.split(" ")[1]).zone("+05:00").format(
                          "hh DD-MM-YYYY"
                        )
                      : `${convertDate}`}
                  </h1> */}
                </div>
              );
            }
            return (
              <ItemMessage
                messages={messages}
                message={message}
                index={idx}
                key={`${message?.id}-${idx}`}
                progressBar={progressBar}
                selectedFile={selectedFile}
                imageLoaded={imageLoaded}
                sendJsonMessage={sendJsonMessage}
              />
            );
          })}
        <div ref={(currentEl) => (messagesRef = currentEl)}></div>
      </ul>
    </ChatMessageListStyled>
  );
}

const ChatMessageListStyled = styled.div`
  padding: 16px;
  background-color: #ccc;
  overflow: auto;
  flex: 1 1 100%;

  /* Track */
  /* width */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-date {
    text-align: center;
    margin: 30px 0;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 1px;
      background: #9a9a9a;
    }

    h1 {
      position: relative;
      z-index: 2;
      border-radius: 20px;
      background: #9a9a9a;
      padding: 3px 10px;
      font-size: 16px;
      color: #fff;
      display: inline-block;
    }
  }

  ul {
    li {
      &.other-file {
        .chat-text-wrapper {
          .chat-text {
            font-size: 16px !important;
            color: #fff;
            cursor: pointer;
            background: none;
            border: none;
            text-decoration: underline;
          }
        }

        &.chat-left {
          .chat-text {
            color: #000;
          }
        }
      }
    }
  }

  li.chat-right,
  li.chat-left {
    display: flex;
    flex: 1;
    flex-direction: row;
    margin-bottom: 40px;

    .chat-avatar {
      align-self: flex-end;
    }

    .chat-name {
      display: flex;
      align-items: center;
    }

    .chat-text-wrapper {
      align-self: flex-start;
      word-break: break-all;
      &.hasEmoj {
        background-color: transparent;

        .chat-text {
          font-size: 45px;
          line-height: 1;
        }
      }
    }

    &.chat-videos {
      .chat-text-wrapper {
        background-color: transparent;
        padding: 0;

        video {
          width: 100%;
          max-width: 300px;
          border-radius: 12px;
        }
      }
    }
  }

  li {
    &.chat-left {
      &.chat-stocks {
        .chat-text-wrapper {
          h4 {
            color: #000;
          }

          background-color: #fff;
          padding: 0;
          max-width: 420px;
          width: 100%;
        }
      }
    }

    &.chat-right {
      justify-content: flex-end;

      &.chat-stocks {
        h4 {
          color: #000;
        }
        .chat-text-wrapper {
          background-color: #fff;
          padding: 0;
          max-width: 420px;
          width: 100%;
        }
      }

      &.chat-image {
        img:not(.icon40) {
          width: 100%;
          height: auto;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .chat-text-wrapper {
          max-width: 15%;
          padding: 0;

          .chat-text {
            display: inline-block;
            padding: 10px;
          }
        }

        .chat-href {
          color: #e2e2e2;
          font-size: 10px;
          display: inline-block;
          margin-left: 10px;
          cursor: hover;
        }
      }
    }
    .chat-name {
      font-size: 0.75rem;
      color: #999999;
      text-align: center;
    }

    .chat-text-wrapper {
      padding: 0.4rem 1rem;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      font-weight: 300;
      line-height: 150%;
      position: relative;
      max-width: 55%;
      font-size: 0.9rem;
    }

    .chat-spacer {
      width: 50px;
      display: inline-block;
    }

    .chat-hour {
      float: right;
      font-size: 12px;
      margin-left: 8px;
      margin-right: 3px;
    }
  }

  @media (max-width: 1600px) {
    li {
      &.chat-right {
        justify-content: flex-end;

        &.chat-image {
          cursor: pointer;
          .chat-text-wrapper {
            max-width: 30%;
            padding: 0;

            .chat-text {
              display: inline-block;
              padding: 10px;
            }
          }
        }
      }
    }
  }
`;

export default ChatMessageList;
