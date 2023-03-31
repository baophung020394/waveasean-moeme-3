import Loader from "components/Spinner/Loader";
import React from "react";
import { Image, Segment } from "semantic-ui-react";
import { styled } from "utils/styled-component";

function SkeletonChatbar() {
  return (
    <SkeletonChatbarStyled>
      <div className="card-chatbar">
        <div className="profile_thumb"></div>
        <div className="content">
          <h1 className="post_title"></h1>
          <h1 className="post_title"></h1>
        </div>
      </div>
    </SkeletonChatbarStyled>
  );
}

const SkeletonChatbarStyled = styled.div`
  .card-chatbar {
    height: 40px;
    width: 30%;
    background-color: rgb(255, 255, 255);
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    border-radius: 10px;
    box-shadow: rgba(255, 255, 255, 0.2) 0px 15px 25px;
    padding: 0;
    display: flex;

    .content {
      background: none;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .profile_thumb {
    position: relative;
    background: rgb(229, 229, 229);
    max-width: 40px;
    height: 100%;
    border-radius: 50%;
    margin-right: 8px;
    min-width: 40px;
  }

  .post_title {
    width: 100%;
    height: 45%;
    border-radius: 8px;
  }

  .paragraph {
    width: 60%;
    height: 95px;
    border-radius: 8px;
    background: #e5e5e5;
    margin-top: 20px;
    float: right;
  }

  .card-chatbar * {
    background: linear-gradient(
      120deg,
      #e5e5e5 30%,
      #f0f0f0 38%,
      #f0f0f0 40%,
      #e5e5e5 48%
    );
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: run 2s infinite;
  }

  @keyframes run {
    100% {
      background-position: -100% 0;
    }
  }

  .subscribe_field {
    position: absolute;
    top: 80%;
    left: 50%;
    width: 200px;
    height: 50px;
    text-transform: capitalize;
    transform: translate(-50%, -50%);
    border-radius: 30px;
    background: #fe0000;
    color: white;
    border: none;

    cursor: pointer;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .subscribe_field:hover {
    box-shadow: 0 0 6px 5px rgba(255, 255, 255, 0.2);
  }
  .subscribe {
    letter-spacing: 2px;
    text-decoration: none;
    color: white;
  }
`;
export default SkeletonChatbar;
