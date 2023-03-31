import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Icon, Image, Modal } from "semantic-ui-react";
import { styled } from "utils/styled-component";

interface FormConfirmProfileProps {
  isOpenConfirm: boolean;
  handleCloseConfirm: () => void;
  handleOpenConfirm: () => void;
  handleOpenCreate: () => void;
  onSubmits: () => void;
  dataSubmit: any;
  roomId: string;
  user: any;
}

function FormConfirmProfile({
  isOpenConfirm,
  handleCloseConfirm,
  handleOpenConfirm,
  handleOpenCreate,
  onSubmits,
  dataSubmit,
  roomId,
  user,
}: FormConfirmProfileProps) {
  const [selectedImage, setSelectedImage] = useState<any>();

  /**
   * Submit data and access room
   */
  const handleSubmit = () => {
    onSubmits();
  };

  /**
   * Upload image
   * @param e
   */
  const onUploadImage = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files[0]);

      const image = e.target.files[0];
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("userid", user?.userId);
      formData.append("roomid", roomId);
      formData.append("file", image);
      const response: any = await axios.post(
        "http://moa.aveapp.com:21405/file/api/roomuserprofileupload_proc.jsp",
        formData,
        config
      );
      setSelectedImage(response?.data);
      console.log("response", response);
    }
  };

  return (
    <FormConfirmProfileStyled>
      <Modal
        className="modal-create-profile"
        //   onClose={handleCloseConfirm}
        onOpen={handleOpenConfirm}
        open={isOpenConfirm}
      >
        <Modal.Header>Confirm profile</Modal.Header>

        <Modal.Content>
          <Modal.Description>
            <div className="image-profile">
              <Image
                avatar
                src={
                  !selectedImage
                    ? `https://i.pinimg.com/originals/7a/4f/c4/7a4fc4c1f4f8c22f0e73a524057c106f.jpg`
                    : `http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${user?.userId}&roomid=${roomId}`
                }
                size="small"
              />
              <button className="btn-hover mr-3">
                <div id="fileUpload">
                  <label htmlFor="file-input">
                    <span className="icon24 img-hover">
                      <Icon name="photo" size="large" />
                    </span>
                    <span className="icon24 img-show">
                      <Icon name="photo" size="large" />
                    </span>
                  </label>
                  <input
                    className="file-input"
                    id="file-input"
                    type="file"
                    onChange={onUploadImage}
                  />
                </div>
              </button>
            </div>

            <span className="user-name">
              {dataSubmit?.roomUserName}
              <Icon
                name="pencil"
                size="small"
                onClick={handleOpenCreate}
              />{" "}
            </span>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            primary
            onClick={handleSubmit}
            className="confirm"
          >
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    </FormConfirmProfileStyled>
  );
}

const FormConfirmProfileStyled = styled.div`
  #fileUpload > label {
    margin: 0;
    cursor: pointer;
  }
  #fileUpload > .file-input {
    display: none;
  }
`;
export default FormConfirmProfile;
