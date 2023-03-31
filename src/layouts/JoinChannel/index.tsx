import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { styled } from "utils/styled-component";
import { Button, Form, Header, Icon, Image } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { setDetailChannel } from "api/channel";
import { joinedChannel } from "api/channel";
import FormCreateProfile from "./FormCreateProfile";
import FormConfirmProfile from "./FormConfirmProfile";
import { changeMyChatName } from "actions/auth";

function JoinChannel() {
  const { id }: any = useParams();
  const [currentChannels, setCurrentChannels] = useState<any>({});
  const [isOpenCreateProfile, setIsOpenCreateProfile] =
    useState<boolean>(false);
  const [isOpenConfirmProfile, setIsOpenConfirmProfile] =
    useState<boolean>(false);
  const [dataSubmit, setDataSubmit] = useState<any>({});
  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });
  const history = useHistory();
  const dispatch: any = useDispatch();

  const handleOpenCreateProfile = () => setIsOpenCreateProfile(true);
  const handleCloseCreateProfile = () => setIsOpenCreateProfile(false);
  const handleOpenConfirmProfile = () => setIsOpenConfirmProfile(true);
  const handleCloseConfirmProfile = () => setIsOpenConfirmProfile(false);

  /**
   *
   */
  const checkUserInChannel = async () => {
    const response: any = await setDetailChannel(user?.userId, id);

    if (response?.result === "success") {
      setCurrentChannels(response);
    }
  };

  /**
   * Handle join channel
   */
  const handleJoinChannel = async () => {
    const data = {
      roomUserName: user?.userName,
      userId: user?.userId,
      roomId: currentChannels?.roomId,
    };
    const response: any = await joinedChannel(data);
    console.log("response", response);

    if (response?.result === "success") {
      history.push(`/channel-detail/${id}`);
    }
  };

  // console.log("currentChannels", currentChannels);

  const handleCreateProfile = async () => {
    await dispatch(changeMyChatName(dataSubmit));
    await joinedChannel(dataSubmit);
    history.push(`/channel-detail/${id}`);
  };

  const handleSubmitCreate = (data: any) => {
    console.log("data main", data);
    const cloneData = { ...data };
    cloneData.userId = user?.userId;
    cloneData.roomId = id;
    setDataSubmit(cloneData);
    handleOpenConfirmProfile();
  };

  useEffect(() => {
    checkUserInChannel();
  }, []);

  return (
    <RequestLoginStyled className="login-view">
      <div className="login--box">
        <Header as="h3">Please choose profile to use on this channel</Header>
        <div className="login--profiles">
          <div className="login--profiles__profile">
            <Image
              className="channel-image"
              avatar
              size="small"
              src={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=3&userid=${user?.userId}&roomid=${currentChannels?.roomId}`}
            />
            <Header as="h3">{user?.userName}</Header>
            <Button
              className="btn-request-login"
              color="twitter"
              onClick={handleJoinChannel}
            >
              Join channel
            </Button>
          </div>
          <div className="login--profiles__profile">
            <div className="icon-plus">
              <Icon name="plus" size="huge" />
            </div>
            <Header as="h3">New Profile</Header>
            <Button
              className="btn-request-login"
              color="green"
              onClick={handleOpenCreateProfile}
            >
              Create profile and Join channel
            </Button>
          </div>
        </div>
      </div>

      <FormCreateProfile
        isOpenCreate={isOpenCreateProfile}
        handleOpenCreate={handleOpenCreateProfile}
        handleCloseCreate={handleCloseCreateProfile}
        handleOpenConfirmProfile={handleOpenConfirmProfile}
        onSubmits={handleSubmitCreate}
      />
      <FormConfirmProfile
        isOpenConfirm={isOpenConfirmProfile}
        handleOpenConfirm={handleOpenConfirmProfile}
        handleCloseConfirm={handleCloseConfirmProfile}
        handleOpenCreate={handleOpenCreateProfile}
        onSubmits={handleCreateProfile}
        dataSubmit={dataSubmit}
        roomId={id}
        user={user}
      />
    </RequestLoginStyled>
  );
}
const RequestLoginStyled = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon-plus {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login--profiles {
    display: flex;
    justify-content: center;
    &__profile {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .btn-request-login {
    border-radius: 20px;
    padding: 10px 30px;
    a {
      color: #fff;
    }
  }

  .channel-image {
    min-width: 150px;
    min-height: 150px;
    object-fit: cover;
    border: 1px solid #ccc;
  }

  .login--box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login--box__form {
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    padding: 40px 40px;
    min-width: 480px;
    max-width: 480px;

    h1 {
      font-size: 26px;
      text-align: center;
      margin-bottom: 48px;
    }

    .form--inputs {
      width: 100%;
      border: 1px solid #e2e2e2;
      border-radius: 8px;

      input {
        width: 100%;
        border: none;
        min-height: 48px;
        padding: 0 10px;
      }

      &__input.userid {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom: 1px solid #e2e2e2;

        input {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
      }

      &__input.password {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        input {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }

    .btn-options {
      text-align: right;
      margin-top: 60px;
      display: flex;
      justify-content: flex-end;

      .btn-login {
        color: #fff;
        padding: 10px 0;
        display: inline-block;
        min-width: 96px;
        max-height: 40px;
        border: none;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .forgot-options {
    text-align: center;
    padding: 20px 0;

    a {
      color: #707070;
      font-size: 14px;

      border-right: 1px solid #e2e2e2;
      margin-right: 16px;
      padding-right: 16px;

      &:last-child {
        margin-right: 0;
        border-right: none;
      }
    }
  }
  .footer-copyright {
    img {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
    span {
      color: #707070;
      font-size: 14px;
    }
  }
`;
export default JoinChannel;
