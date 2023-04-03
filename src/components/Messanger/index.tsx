import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
// import IconFileGrey from "assets/images/chat/send_file_grey.png";
// import IconFileHover from "assets/images/chat/send_file_blue.png";
// import IconScreenShotGrey from "assets/images/chat/screenshot_grey.png";
// import IconScreenShotHover from "assets/images/chat/screenshot_hover.png";
// import IconChatGrey from "assets/images/chat/chat_enter_grey.png";
// import IconChatBlue from "assets/images/chat/chat_enter_blue.png";
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  Emoji,
  SuggestionMode,
  SkinTonePickerLocation,
} from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";
import { createTimestamp } from "utils/time";
import { useSelector } from "react-redux";
import { convertFiles } from "utils/handleFiles";

import { MentionsInput, Mention } from "react-mentions";
import MentionsInputStyle from "./MentionsInputStyle";
import { Icon } from "semantic-ui-react";
import MentionStyle from "./MentionStyle";
import firebase from "db/firestore";

interface MessangerProps {
  joinedUsersState?: any;
  channel: any;
  messages?: any;
  onSubmit: (message: any) => void;
  uploadFileProp?: (data: any) => void;
}

function Messanger({
  joinedUsersState,
  onSubmit,
  channel,
  messages,
  uploadFileProp,
}: MessangerProps) {
  const [value, setValue] = useState<any>("");
  const [ids, setIds] = useState<any>([]);
  const [isOpenEmoj, setIsOpenEmoj] = useState<boolean>(false);
  const textareaRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const userRedux = useSelector(({ auth }) => auth.user);
  const currentChannel = useSelector(({ channel }) => channel.currentChannel);
  const actionsUserRef = firebase.database().ref("actionsUser");
  const [profile] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });

  let myuuid = uuidv4();

  /**
   * Choose Emoji
   * @param emojiData
   * @param event
   */
  const onClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    const textAreaElement: any = document.getElementById("text-area");
    setValue(
      value.substr(0, textAreaElement.selectionStart) +
        emojiData.emoji +
        value.substr(textAreaElement.selectionEnd)
    );
  };

  /**
   *  This function will be triggered when the file field change
   * */
  const uploadChange = (e: any) => {
    if (e.target.files) {
      const file = e.target.files[0];
     
      const messages: any = {
        idMessage: myuuid,
        content: value.trim(),
        user: profile,
        // type: 2,
        file: file
      };
      uploadFileProp(messages);
      // const reader = new FileReader();

      // reader.readAsDataURL(image);

      // reader.onload = () => {
      // let newMessage = {
      //   content: `${e.target.files[0].type}`,
      //   files: JSON.stringify(reader?.result),
      //   idMessage: myuuid,
      //   user,
      //   timestamp: createTimestamp(),
      //   fileType: e.target.files[0].type,
      // };

      // reader.onloadend
      //   onSubmit(newMessage);
      // };
    }
  };

  /**
   * Check key press 'Enter'
   * @param e
   */
  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      setValue("");
    }
  };

  /**
   * Submit form data
   * @returns
   */
  const sendMessage = async () => {
    if (value.trim() === "") return;

    const messages: any = {
      idMessage: myuuid,
      content: value.trim(),
      user: profile,
      timestamp: createTimestamp(),
      type: 0,
    };

    onSubmit(messages);
  };

  const handleAddUsersMention = (id: string, display: string) => {
    if (ids.includes(id)) {
      console.log("trung");
    } else {
      setIds((prev: any) => [...prev, id]);
    }
  };

  /**
   * Capture
   */
  const capture = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = document.createElement("video");

    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia();
      video.srcObject = captureStream;
      context.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
      const frame = canvas.toDataURL("image/png");
      captureStream.getTracks().forEach((track) => track.stop());
      window.location.href = frame;
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  const dropHandler = (ev: any) => {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
         
          const messages: any = {
            idMessage: myuuid,
            content: value.trim(),
            user: profile,
            type: 2,
          };
          // console.log("newMessage file", newMessage);

          uploadFileProp(messages);
          textareaRef.current.style.border = "1px dashed #e2e2e2";
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
        textareaRef.current.style.border = "1px dashed #e2e2e2";
      });
    }
  };

  const dragOverHandler = (ev: any) => {
    console.log("File(s) in drop zone");
    textareaRef.current.style.border = "3px dashed rgb(29 78 216)";
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  const dragLeaveHandler = (ev: any) => {
    console.log("File(s) in drop zone left");
    textareaRef.current.style.border = "1px solid #e2e2e2";
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  /**
   * Check auto height of Textarea
   */
  // useEffect(() => {
  //   textareaRef.current.style.height = "0px";
  //   const scrollHeight = textareaRef.current.scrollHeight;
  //   textareaRef.current.style.height = scrollHeight + "px";
  // }, [value]);

  /**
   * Check user action typing
   * @param e
   * @returns
   */
  const handleOnChange = (e: any) => {
    // const item = {
    //   action: 1,
    //   username: userRedux.username,
    //   userId: userRedux.uid,
    //   // id: key,
    // };
    // actionsUserRef
    //   .child(currentChannel?.id)
    //   .child(userRedux.uid)
    //   .set(item)
    //   .then(() => console.log("save success"))
    //   .catch((err) => console.log({ err }));
    // if (e.target.value.length <= 0) {
    //   console.log("e.target.value.length", e.target.value.length);
    //   actionsUserRef
    //     .child(currentChannel?.id)
    //     .child(userRedux?.uid)
    //     .update({ action: 0 });
    //   return;
    // }
    // if (typingTimeoutRef.current) {
    //   clearTimeout(typingTimeoutRef.current);
    // }
    // && au?.userId !== user?.uid
    // typingTimeoutRef.current = setTimeout(() => {
    //   // const key = firebase.database().ref("actionsUser").push().key;
    //   if (e.target.value.length <= 0) {
    //     console.log("e.target.value.length", e.target.value.length);
    //     actionsUserRef
    //       .child(currentChannel?.id)
    //       .child(userRedux?.uid)
    //       .update({ action: 0 });
    //     return;
    //   }
    //   actionsUserRef
    //     .child(currentChannel?.id)
    //     .child(userRedux?.uid)
    //     .update({ action: 0 });
    // }, 10000);
  };

  useEffect(() => {
    return () => {
      setValue("");
    };
  }, []);

  return (
    <MessangerStyled
      className={`${
        channel?.enableWriteMsg === "0" ? "enableWriteMsg" : ""
      } chat-input form-group mt-3 mb-0`}
    >
      <MentionsInput
        style={MentionsInputStyle}
        id="text-area"
        inputRef={textareaRef}
        onKeyPress={onKeyPress}
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleOnChange(e);
        }}
        className="mentions-input"
        placeholder={`${
          channel?.enableWriteMsg === "0"
            ? "Chat is disabled"
            : "Type your message here.../ Type '@' to mentions users in channel"
        } `}
      >
        <Mention
          onAdd={(id, display) => {
            handleAddUsersMention(id, display);
          }}
          data={joinedUsersState}
          trigger="@"
          markup="@[__display__]"
          style={MentionStyle}
          className="mention-name"
        />
      </MentionsInput>

      <div className="chat-input__options">
        <div className="chat-input__options__left">
          <button className="btn-hover mr-3">
            <div id="fileUpload">
              <label htmlFor="file-input">
                <span className="icon24 img-hover">
                  <Icon name="file" size="large" color="brown" />
                </span>
                <span className="icon24 img-show">
                  <Icon name="file" size="large" color="grey" />
                </span>
              </label>
              <input
                className="file-input"
                id="file-input"
                type="file"
                onChange={(e) => {
                  uploadChange(e);
                  e.target.value = null;
                }}
              />
            </div>
          </button>
          <button className="btn-hover" onClick={capture}>
            <span className="icon24 img-hover">
              <Icon name="photo" size="large" color="brown" />
            </span>
            <span className="icon24 img-show">
              <Icon name="photo" size="large" color="grey" />
            </span>

            {/* <img className="icon24 img-show" src={IconScreenShotGrey} alt="" />
            <img
              className="icon24 img-hover"
              src={IconScreenShotHover}
              alt=""
            /> */}
          </button>
          <div className="ml-3 chat--emoj">
            <button
              className="btn-hover"
              onClick={() => setIsOpenEmoj(!isOpenEmoj)}
            >
              <img
                className="icon24 img-show"
                src="https://cdn-icons-png.flaticon.com/512/1500/1500458.png"
                alt=""
              />
              <img
                className="icon24 img-hover"
                src="https://cdn-icons-png.flaticon.com/512/1500/1500458.png"
                alt=""
              />
            </button>

            <div className="chat--emoj__display">
              {isOpenEmoj && (
                <>
                  <EmojiPicker onEmojiClick={onClick} autoFocusSearch={false} />
                  <div
                    className="layer"
                    onClick={() => setIsOpenEmoj(false)}
                  ></div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="chat-input__options__right">
          <button
            className="btn-hoveree btn-chat"
            onClick={() => {
              sendMessage();
              setValue("");
            }}
          >
            {(value?.length > 0 && channel?.enableWriteMsg === "1") ||
            value?.lenght > 0 ? (
              <Icon name="send" size="large" />
            ) : (
              // <img className="icon24 img-hover" src={IconChatBlue} alt="" />
              <Icon name="send" size="large" disabled />
              // <img className="icon24 img-show" src={IconChatGrey} alt="" />
            )}
          </button>
        </div>
      </div>
    </MessangerStyled>
  );
}

const MessangerStyled = styled.div`
  position: relative;
  border: 1px solid #e2e2e2;
  max-width: 97%;
  width: 100%;
  margin: auto;
  border-radius: 8px;
  flex: 1 1 115px;

  &.enableWriteMsg {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 99;
    }
  }

  .mentions-input {
    textarea {
      overflow-y: auto !important;
    }

    strong.mention-name {
      background-color: #cee4e5;
    }
  }

  .chat-input__options {
    padding: 16px;
    display: flex;
    justify-content: space-between;

    &__left {
      width: 100%;
      border-right: 1px solid #e2e2e2;
    }

    button {
      background: none;
      border: none;
    }
  }

  #fileUpload > label {
    margin: 0;
    cursor: pointer;
  }
  #fileUpload > .file-input {
    display: none;
  }

  .chat--emoj {
    display: inline-block;
    position: relative;
    &__display {
      position: absolute;
      bottom: 32px;
      left: 0;
      z-index: 0;

      .EmojiPickerReact {
        z-index: 9;
      }

      .layer {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 0;
        background: transparent;
        width: 100%;
        height: 100%;
      }
    }
  }

  .btn-hover {
    &.btn-chat {
      .img-hover {
        display: inline-block;
      }
    }
  }
`;

export default Messanger;
