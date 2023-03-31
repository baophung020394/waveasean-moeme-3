import ChannelList from "components/ChannelList";
import NewChannels from "components/NewChannels";
import { withBaseLayout } from "layouts/Base";
import React from "react";
import styled from "styled-components";

function Channel( ) {
  return (
    <ChannelStyled className="channel-container">
      <div className="channel-container__list">
        <ChannelList />
      </div>
      <NewChannels />
    </ChannelStyled>
  );
}

const ChannelStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  .channel-container {
    &__list {
      width: 33%;
      max-width: 420px;
      border-right: 1px solid #e6ecf3;
    }
  }
`;

export default withBaseLayout(Channel);
