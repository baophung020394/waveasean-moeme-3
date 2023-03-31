import IconCreateChannel from "assets/images/channel/plus.png";
import CreateChannel from "components/CreateChannel";
import CustomModal from "components/CustomModal";
import Error from "components/Error";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "utils/styled-component";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { CONSTANT_CHANNEL_SOCKET } from "constants/channel-socket";
import { CONSTANT_AUTH_SOCKET } from "constants/auth-socket";
import { useWebSocketHook } from "hooks/useWebsocket";

interface NewChannelsProps {
  availableChannels?: any;
  joinedChannels?: any;
  channels?: any;
}

function NewChannels({
  availableChannels,
  joinedChannels,
  channels,
}: NewChannelsProps) {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch: any = useDispatch();
  const token = useSelector(({ auth }) => auth.token);
  const error = useSelector(({ channel }) => channel?.isLoading.error);
  const [profile] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });
  const { sendJsonMessage, lastJsonMessage }: any = useWebSocketHook();

  const onCreateChannel = (data: any) => {
    if (data?.roomName === "") return;
    sendJsonMessage({
      ptCommand: CONSTANT_CHANNEL_SOCKET.PTCOMMAND_CREATE,
      ptGroup: CONSTANT_CHANNEL_SOCKET.PTGROUP_CHANNEL,
      ptDevice: "web",
      params: data,
    });
    setOpen(false);
  };

  useEffect(() => {
    if (lastJsonMessage) {
      switch (lastJsonMessage?.ptCommand) {
        case CONSTANT_CHANNEL_SOCKET.PTCOMMAND_CREATE:
          sendJsonMessage({
            ptCommand: CONSTANT_CHANNEL_SOCKET.PTCOMMAND_LIST,
            ptGroup: CONSTANT_CHANNEL_SOCKET.PTGROUP_CHANNEL,
            ptDevice: "",
            params: {
              userId: profile?.userId,
            },
          });
          break;

        default:
          break;
      }
    }
  }, [lastJsonMessage]);

  return (
    <AvailableChatsStyled>
      <div className="new-channels--header">
        <button
          className="new-channels--header__plus btn-hover"
          onClick={() => setOpen(!open)}
        >
          <img className="icon40 img-show" src={IconCreateChannel} alt="" />
          <img className="icon40 img-hover" src={IconCreateChannel} alt="" />
        </button>

        <CustomModal
          title="Create channel"
          componentName="create--channel-modal"
          open={open}
          onClick={() => setOpen(!open)}
          submitForm={() => {}}
        >
          <CreateChannel
            title="Create channel"
            bgColor="https://images.unsplash.com/photo-1534841090574-cba2d662b62e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MjB8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80"
            submitForm={onCreateChannel}
            closeFunc={() => setOpen(!open)}
          />
        </CustomModal>

        <CustomModal
          title="Create channel fail"
          componentName="create--channel-error-modal"
          open={error && error?.message?.length > 0}
          onClick={() => dispatch({ type: "CHANNELS_CREATE_FAIL" })}
          submitForm={() => {}}
        >
          <Error error={error} />
        </CustomModal>
      </div>
      {/* <div className="availables container-fluid mt-3">
        {false && (
          <div className="availables--null">
            <div className="alert alert-warning">No channels to join :(</div>
          </div>
        )}

        <div className="available--created ">
          <div className="container-fluid">
            {availableChannels?.length > 0 &&
              availableChannels.map((channel: any, idx: number) => (
                <div
                  className="available mb-4"
                  key={`${channel?.room_name}-${idx}`}
                >
                  <CardChannel
                    channel={channel}
                    key={`${channel?.room_name}-${idx}`}
                    onClick={() => setIsGoChannel("JOIN_CHANNEL")}
                    isGoChannel="JOIN_CHANNEL"
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="available--exists">
          <div className="container-fluid">
            {channels?.length > 0 &&
              channels
                .filter(({ roomId }: any) => !idsChannels.has(roomId))
                .filter(({ roomId }: any) => !ids.has(roomId))
                .filter(
                  (channel: any) =>
                    (channel?.room_type === "2" ||
                      channel?.room_type === "3") &&
                    channel?.ownserId !== user.uid
                )
                .map((channel: any, idx: number) => (
                  <div
                    key={`${channel?.room_name}-${idx}`}
                    className="available mb-4"
                    onClick={() => setIsGoChannel("CREATE_CHANNEL")}
                  >
                    <CardChannel
                      channel={channel}
                      key={`${channel?.room_name}-${idx}`}
                      onClick={() => {}}
                      isGoChannel="CREATE_CHANNEL"
                    />
                  </div>
                ))}
          </div>
        </div>
      </div> */}
    </AvailableChatsStyled>
  );
}

const AvailableChatsStyled = styled.div`
  width: 100%;

  .new-channels--header {
    padding: 0 20px;
    border-bottom: 1px solid #e6ecf3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 91px;
    max-height: 91px;

    &__plus {
      background: #3747a6;
      border: 1px solid #3747a6;
      border-radius: 100%;
      box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);

      &:hover {
        background: #4c59ac;
      }
    }
  }

  .availables {
    height: calc(100% - 107px);
    overflow: auto;

    .available {
      min-width: 300px;
      max-width: 25%;
      flex: 1 1 23%;
      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }
    }

    .available--created {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;

      h1 {
        font-size: 24px;
        padding-right: 15px;
        padding-left: 15px;
      }

      .container-fluid {
        display: flex;
        flex-wrap: wrap;
        padding: 0;
      }
    }

    .available--exists {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;

      h1 {
        font-size: 24px;
        padding-right: 15px;
        padding-left: 15px;
      }

      .container-fluid {
        display: flex;
        flex-wrap: wrap;
        padding: 0;
      }
    }
  }
`;
export default NewChannels;
