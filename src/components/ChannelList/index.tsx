import { getChannelList } from "actions/channel";
import CardChannelList from "components/CardChannelList";
import FilterChannels from "components/Filters/FilterChannels";
import FilterChannelType from "components/Filters/FilterChannelType";
import LoadingView from "components/Spinner/LoadingView";
import Title from "components/Title";
import { CONSTANT_CHANNEL_SOCKET } from "constants/channel-socket";
import { useWebSocketHook } from "hooks/useWebsocket";
import { Channel } from "models/channel";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
interface ChannelListProps {
  id?: string;
}

function ChannelList({ id }: ChannelListProps) {
  const [profile] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });
  const dispatch: any = useDispatch();
  const isLoading = useSelector(({ channel }) => channel?.channel?.result);
  const channels = useSelector(({ channel }) => channel.channel);
  const filterChannels = useSelector(({ channel }) => channel?.filterChannels);
  const filterChannelType = useSelector(
    ({ channel }) => channel?.filterChannelType
  );
  const { loginSocket, sendJsonMessage } = useWebSocketHook();
  let myuuid = uuidv4();

  /**
   * Fetch channels by REST API
   */
  const fetchListChannels = () => {
    dispatch(getChannelList(profile?.userId));
  };

  // console.log("channels", channels);

  /**
   * Fetch channels by socket
   */
  const initChannelsBySocket = () => {
    sendJsonMessage({
      ptCommand: CONSTANT_CHANNEL_SOCKET.PTCOMMAND_LIST,
      ptGroup: CONSTANT_CHANNEL_SOCKET.PTGROUP_CHANNEL,
      ptDevice: "",
      params: {
        userId: profile?.userId,
      },
    });
  };

  useEffect(() => {
    if (loginSocket?.userId) {
      initChannelsBySocket();
    }
  }, [loginSocket]);

  useEffect(() => {
    if (channels?.data?.length > 0) {
      const filterChannel = channels?.data
        ?.filter((cn: any) => {
          if (filterChannels === 2) {
            return (
              ["2", "3"].includes(cn?.room_type) &&
              cn?.ownerId === profile?.userId
            );
          } else {
            return channels?.data;
          }
        })
        .filter((cn: any) => {
          if (filterChannelType === 5) {
            return cn?.chnl_type === "PER";
          } else if (filterChannelType === 4) {
            return cn?.chnl_type === "ORG";
          } else if (filterChannelType === 6) {
            return cn?.chnl_type === "SPL";
          } else {
            return channels?.data;
          }
        });
    }
  }, [channels?.data, filterChannels, filterChannelType]);

  if (isLoading) {
    return <LoadingView message="Load channels...." />;
  }

  return (
    <ChannelListStyled className="channel-list">
      <Title name="Channels" />
      <div>
        {/* <button
          onClick={() => {
            sendJsonMessage({
              ptCommand: 65537,
              ptGroup: 65536,
              params: {
                deviceType: "web",
                userId: "test3",
                userPassword: "1234",
              },
            });
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            sendJsonMessage({
              ptCommand: 262146,
              ptGroup: 262144,
              ptDevice: "",
              params: {
                enableWriteMsg: "1",
                roomProfileImage: "",
                userId: "test3",
                roomId: myuuid,
                roomName: `Test cn ${myuuid}`,
                roomComment: "",
                enableSearch: "1",
                roomType: 2,
                chnl_open_type: "1",
                maxUser: "2000",
              },
            });
          }}
        >
          Create Channel
        </button> */}
      </div>
      <FilterChannels />
      <FilterChannelType />
      <div className="card--container">
        {channels?.data.length > 0 &&
          channels?.data
            .filter((cn: any) => {
              if (filterChannels === 2) {
                return (
                  ["2", "3"].includes(cn?.room_type) &&
                  cn?.ownerId === profile?.userId
                );
              } else {
                return channels?.data;
              }
            })
            .filter((cn: any) => {
              if (filterChannelType === 5) {
                return cn?.chnl_type === "PER";
              } else if (filterChannelType === 4) {
                return cn?.chnl_type === "ORG";
              } else if (filterChannelType === 6) {
                return cn?.chnl_type === "SPL";
              } else {
                return channels?.data;
              }
            })
            .map((channel: Channel, index: number) => {
              return (
                <CardChannelList
                  channel={channel}
                  key={`${channel?.room_name}-${index}`}
                />
              );
            })}
      </div>
    </ChannelListStyled>
  );
}

const ChannelListStyled = styled.div`
  height: 100%;

  .card--container {
    padding: 10px;
    height: calc(100% - 165px);
    overflow-y: auto;

    /* width */
    &::-webkit-scrollbar {
      width: 8px;
      display: none;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 20px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    &:hover {
      &::-webkit-scrollbar {
        display: unset;
      }
    }
  }
`;
export default ChannelList;
