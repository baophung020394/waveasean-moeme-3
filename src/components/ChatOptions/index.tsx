import React, { useEffect, useState } from "react";
import { styled } from "utils/styled-component";
import IconTrash from "assets/images/chat/trash.png";
import IconSpeaker from "assets/images/chat/speaker.png";
import IconBring from "assets/images/chat/bring.png";
import IconMic from "assets/images/chat/mic.png";
import IconEdit from "assets/images/chat/edit2.png";
import IconStock from "assets/images/chat/stock.png";
import CreateStock from "components/CreateStock";
import { v4 as uuidv4 } from "uuid";
import { createTimestamp } from "utils/time";
import { useSelector } from "react-redux";
import { Button, Modal } from "semantic-ui-react";
import { CONSTANT_MESSAGE_SOCKET } from "constants/messages-socket";

interface ChatOptions {
  submitStock: (data: any) => void;
  sendJsonMessage: (data: any) => void;
  roomId: string;
}

function ChatOptions({
  roomId,
  submitStock,
  sendJsonMessage,

}: ChatOptions) {
  const [isOpenStock, setIsOpenStock] = useState(false);
  const user = useSelector(({ auth }) => auth.user);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [profile] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });

  const handleOpenDelete = () => setIsOpenDelete(true);
  const handleCloseDelete = () => setIsOpenDelete(false);
  let myuuid = uuidv4();

  const onSubmit = (data: any) => {
    let newMessage = {
      content: "",
      idMessage: myuuid,
      user,
      stocks: data,
      timestamp: createTimestamp(),
      type: 3,
    };

    // localStorage.setItem("_messages", JSON.stringify(newMessage));
    submitStock(newMessage);
    setIsOpenStock(false);
  };

  const handleDelete = () => {
    sendJsonMessage({
      ptCommand: 262184,
      ptGroup: 262144,
      ptDevice: "",
      params: {
        userId: profile?.userId,
        roomId,
      },
    });
    handleCloseDelete();
  };


  return (
    <ChatOptionsStyled>
      <div className="chat--options">
        <div className="chat--options__left">
          <button className="btn-hover" onClick={handleOpenDelete}>
            <img className="icon24 img-show" src={IconTrash} alt="" />
            <img className="icon24 img-hover" src={IconTrash} alt="" />
          </button>
          {/* <button className="btn-hover">
            <img className="icon24 img-show" src={IconSpeaker} alt="" />
            <img className="icon24 img-hover" src={IconSpeaker} alt="" />
          </button>
          <button className="btn-hover">
            <img className="icon24 img-show" src={IconBring} alt="" />
            <img className="icon24 img-hover" src={IconBring} alt="" />
          </button>
          <button className="btn-hover">
            <img className="icon24 img-show" src={IconMic} alt="" />
            <img className="icon24 img-hover" src={IconMic} alt="" />
          </button> */}
        </div>
        <div className="chat--options__right">
          {/* <button className="btn-hover">
            <img className="icon24 img-show" src={IconEdit} alt="" />
            <img className="icon24 img-hover" src={IconEdit} alt="" />
          </button> */}
          <div className="stock-option">
            <button
              className="btn-hover"
              onClick={() => setIsOpenStock(!isOpenStock)}
            >
              <img className="icon24 img-show" src={IconStock} alt="" />
              <img className="icon24 img-hover" src={IconStock} alt="" />
            </button>
            {isOpenStock ? (
              <CreateStock submitForm={onSubmit} closeFunc={setIsOpenStock} />
            ) : null}
          </div>
        </div>
      </div>

      <Modal open={isOpenDelete} className="modal-confirm">
        <h3>Do you want to delete this message?</h3>
        <Modal.Actions>
          <Button content="Yes" primary onClick={handleDelete} />
          <Button content="No" secondary onClick={handleCloseDelete} />
        </Modal.Actions>
      </Modal>
    </ChatOptionsStyled>
  );
}

const ChatOptionsStyled = styled.div`
  .stock-option {
    position: relative;
  }

  .chat--options {
    background-color: #ccc;
    padding: 15px;

    button {
      position: relative;
      margin-right: 6px;
    }

    display: flex;
    align-items: center;

    justify-content: space-between;

    &__right {
      display: flex;
      align-items: center;
    }
  }
`;
export default ChatOptions;
