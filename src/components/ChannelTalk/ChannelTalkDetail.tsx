import React, { useState } from "react";
import { Comment, Header, Icon, Image, Modal } from "semantic-ui-react";
import { styled } from "utils/styled-component";
import { formatTimeAgo } from "utils/time";

interface ChannelTalkDetailProps {
  message: any;
}
function ChannelTalkDetail({ message }: ChannelTalkDetailProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //   console.log("first", message.content.replace(/<img .*?>/g, ""));
  //   console.log("first", message.content.replace(/(<([^>]+)>)/ig, ""))
  return (
    <ChannelTalkDetailStyled>
      <span className="tag-icon">
        <Icon name="tag" />
      </span>

      <div
        className="chat-channel-content text"
        dangerouslySetInnerHTML={{
          __html: message.content
            .replace(/<img .*?>/g, "")
            .replaceAll("<p><br></p>", ""),
        }}
      />

      <div className="chat-channel-content">
        <Image src={message?.files} />
      </div>

      <div className="chat-channel-content">
        <div
          className="chat-channel-content__detail"
          onClick={() => setIsOpen(true)}
        >
          <span>Read all</span>
          <Icon name="angle right" />
        </div>
      </div>

      <div className="chat-channel-infor">
        <Comment>
          <Comment.Content>
            <Comment.Author as="a">
              <Image src={message?.user.photoURL} avatar />
              {message?.user.username}
            </Comment.Author>
            <Comment.Metadata>
              <div>{formatTimeAgo(message?.timestamp)}</div>
            </Comment.Metadata>
          </Comment.Content>
        </Comment>
      </div>

      <Modal
        className="channel-talk-detail-modal"
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        open={isOpen}
      >
        <Modal.Header>Read all</Modal.Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <div dangerouslySetInnerHTML={{ __html: message?.content }} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </ChannelTalkDetailStyled>
  );
}

const ChannelTalkDetailStyled = styled.div`
  .tag-icon {
    position: absolute;
    top: -7px;
    right: -7px;
    z-index: 0;
    background: #24bc24;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 22px;
    transform: rotate(224deg);

    i {
      color: #fff;
      margin: 0 !important;
    }
  }

  .chat-channel-content {
    margin-bottom: 8px;
    padding: 0.4rem 1rem;

    img {
      max-height: 200px;
      width: 100%;
      object-fit: cover;
    }

    p {
      color: #000;
    }

    &__detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      color: #000;
    }

    &.text {
      max-height: 100px;
      overflow: hidden;
    }
  }

  .chat-channel-infor {
    padding: 0.4rem 1rem;
    border-top: 1px solid #eee;

    .comment {
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        a.author {
          color: #000;
        }
        .metadata {
          color: #000;
        }
      }
    }
  }
`;

export default ChannelTalkDetail;
