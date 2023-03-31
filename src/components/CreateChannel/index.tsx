import IconArrowSelect from "assets/images/channel/arrow-select.png";
import IconClose from "assets/images/channel/close.png";
import IconCreateChannel from "assets/images/channel/next.png";
import IconUploadImage from "assets/images/channel/upload-image.png";
import axios from "axios";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { Checkbox } from "semantic-ui-react";
import { styled } from "utils/styled-component";
import { v4 as uuidv4 } from "uuid";

interface CreateChannelProps {
  submitForm?: (data: any) => void;
  closeFunc?: () => void;
  title?: string;
  bgColor?: string;
}
function CreateChannel({
  title,
  bgColor,
  closeFunc,
  submitForm,
}: CreateChannelProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>("");
  const { register, handleSubmit } = useForm();

  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("_profile"));
  });

  let myuuid = uuidv4();

  const onSubmit = (data: any) => {
    data.enableWriteMsg = isChecked ? "0" : "1";
    data.roomProfileImage = selectedImage?.save_file || "";
    data.userId = user?.userId;
    data.roomId = myuuid;
    data.enableSearch = "1";
    data.roomType = 2;
    data.device = "web";
    submitForm(data);
  };

  /**
   *  This function will be triggered when the file field change
   * */
  const imageChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files[0]);

      const image = e.target.files[0];
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("mode", "17");
      formData.append("dir", "bsimage");
      formData.append("file", image);
      const response: any = await axios.post(
        "http://moa.aveapp.com:21405/file/api/roomprofileupload_proc.jsp",
        formData,
        config
      );
      setSelectedImage(response?.data);
      console.log("response", response);
    }
  };


  // const onChangeUploadImage = async (e: any) => {
  //   setLoading(true);
  //   // dispatch(editAvatarPending());
  //   try {
  // let config = {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // };

  //     if (userid) {
  //       const formData = new FormData();
  //       formData.append('userid', userid);
  //       formData.append('file', e.target.files[0]);
  //       const response: any = await axios.post(
  //         'https://moagroup-file.moaservice.com/file/api/adminprofileupload_proc.jsp',
  //         formData,
  //         config
  //       );
  //       if (response?.status === 200) {
  //         setLoading(false);
  //         window.location.reload();
  //         toast.success(t('common.success'));
  //       } else {
  //         setLoading(false);
  //         toast.error(t('common.fail'));
  //       }
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     toast.error(t('common.error'));
  //     console.log('error', error);
  //   }
  // };

  const handleOnchangeCheckbox = (e: any, data: any) => {
    setIsChecked(data.checked);
  };

  return (
    <CreateChannelStyled
      className="create--channel"
      bgColor={bgColor}
      bgSelect={IconArrowSelect}
      selectedImage={selectedImage}
    >
      <Modal.Header className="create--channel--header">
        <button
          className="create--channel--header__plus close-btn btn-hover"
          onClick={closeFunc}
        >
          <img className="icon24 img-show" src={IconClose} alt="" />
          <img className="icon24 img-hover" src={IconClose} alt="" />
        </button>
        <Modal.Title className="title">{title}</Modal.Title>
        <div className="create-btn">
          <button
            className="create--channel--header__plus  btn-hover"
            onClick={handleSubmit(onSubmit)}
          >
            <img className="icon24 img-show" src={IconCreateChannel} alt="" />
            <img className="icon24 img-hover" src={IconCreateChannel} alt="" />
          </button>
        </div>
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)} className="channels--box__form">
        <div className="form--inputs">
          <div className="form--inputs__input">
            <span>Channel name</span>
            <input {...register("roomName")} type="text" />
          </div>
          <div className="form--inputs__input">
            <span>description</span>
            <textarea {...register("roomComment")} maxLength={30} />
          </div>
          <button className="btn-hover icon-upload" type="button">
            <div id="fileUpload">
              <label htmlFor="file-input">
                <img className="icon24 img-show" src={IconUploadImage} alt="" />
                <img
                  className="icon24 img-hover"
                  src={IconUploadImage}
                  alt=""
                />
              </label>
              <input
                className="file-input"
                id="file-input"
                type="file"
                onChange={imageChange}
              />
            </div>
          </button>
          <div className="form--inputs__input">
            <h4>Operating entity</h4>
            {["radio"].map((type: any) => (
              <div key={`default-${type}`} className="mb-2 radio">
                <Form.Check
                  type={type}
                  id={`default-${type}`}
                  label={`Personal`}
                  {...register("chnl_type")}
                  checked
                  value="PER"
                />
                <Form.Check
                  type={type}
                  id={`default-${type}`}
                  label={`Speciallist`}
                  {...register("chnl_type")}
                  value="SPL"
                />
              </div>
            ))}
          </div>
          <div className="form--inputs__input">
            <div className="mb-3 switches">
              <h4>Only admin can write</h4>

              <Checkbox
                type="checkbox"
                checked={isChecked}
                {...register("enableWriteMsg")}
                toggle
                onClick={handleOnchangeCheckbox}
              />
              {/* <Form.Check
                type="switch"
                id="custom-switch"
                label=""
                {...register("enableWriteMsg")}
              /> */}
            </div>
          </div>
          <div className="form--inputs__input">
            <div className="mb-3 selects-max-user">
              <h4>Max users</h4>
              <div className="select-max-user">
                <select {...register("maxUser")}>
                  <option>100</option>
                  <option>500</option>
                  <option>1000</option>
                  <option>2000</option>
                  <option>3000</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form--inputs__input">
            <h4>Method register</h4>
            {["radio"].map((type: any) => (
              <div key={`default-${type}`} className="mb-2 radio">
                <Form.Check
                  type={type}
                  id={`default-${type}`}
                  label={`Automatic`}
                  {...register("chnl_reg_pass")}
                  checked
                  value="0"
                />
                <Form.Check
                  type={type}
                  id={`default-${type}`}
                  label={`Input password`}
                  {...register("chnl_reg_pass")}
                  value="1"
                />
              </div>
            ))}
          </div>
          <div className="form--inputs__input">
            <h4>Operating entity</h4>
            {["radio"].map((type: any) => (
              <div key={`default-${type}`} className="mb-2 radio">
                <Form.Check
                  type={type}
                  id={`default-${type}`}
                  label={`Public`}
                  {...register("chnl_open_type")}
                  checked
                  value="1"
                />
                <Form.Check
                  type={type}
                  id={`default-${type}`}
                  label={`Unpublic`}
                  {...register("chnl_open_type")}
                  value="0"
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </CreateChannelStyled>
  );
}

const CreateChannelStyled = styled.div<{
  bgColor: string;
  bgSelect: string;
  selectedImage: any;
}>`
  max-width: 375px;
  margin: auto;

  background-image: ${(props) =>
    props.selectedImage
      ? `url(http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=7&serverfile=thumb_${props.selectedImage.save_file})`
      : `url(${props.bgColor})`};
  background-size: contain;
  background-repeat: no-repeat;

  .create--channel--header {
    justify-content: flex-start;
    align-items: center;

    .create-btn {
      order: 2;
      flex: 1 1 auto;
      width: 100%;
      text-align: right;
    }

    .title {
      order: 1;
      min-width: 170px;
      color: #fff;
    }

    &__plus {
      //   background: #ece7e7;
      //   border: 1px solid #ece7e7;
      //   border-radius: 100%;
      //   box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);

      &:hover {
        // background: #ece7e7;
      }

      &.close-btn {
        order: 0;
        margin-right: 8px;
      }
    }
  }

  .channels--box__form {
    margin-top: 40%;
    background: #fff;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 24px;
    position: relative;

    .form--inputs {
      h4 {
        font-size: 14px;
      }

      .icon-upload {
        position: absolute;
        top: -35px;
        right: 14px;
        z-index: 1;
        cursor: pointer;
      }

      &__input {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;
        flex-direction: column;

        .selects-max-user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;

          .select-max-user {
            // background: url(images/downarrow_blue.png) no-repeat right white;

            select {
              -moz-appearance: none; /* Firefox */
              -webkit-appearance: none; /* Safari and Chrome */
              appearance: none;
              border: none;
              background-image: ${(props) =>
                props.bgSelect ? `url(${props.bgSelect})` : "unset"};
              background-repeat: no-repeat;
              background-size: 14px 14px;
              background-position: right;
              padding-right: 16px;
              font-size: 14px;
              cursor: pointer;

              &:focus-visible {
                outline: unset;
              }
            }
          }
        }

        .switches {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;

          h4 {
            // padding-top: 12px;
          }

          .custom-switch {
            display: flex;
            align-items: center;

            input[type="checkbox"] {
              order: 1;
              min-width: auto;
              min-height: auto;
              padding: 0;
              &:checked ~ .custom-control-label {
                &:before {
                  background: #3747a6;
                  border: 1px solid #3747a6;
                }
                &:after {
                  left: calc(-2.25rem + 12px);
                }
              }
            }

            label {
              &::before {
                top: 0;
                height: 20px;
                width: 40px;
                border-radius: 20px;
              }

              &::after {
                top: calc(0px + 3px);
                width: calc(1rem - 2px);
                height: calc(1rem - 2px);
              }
            }
          }
        }

        .radio {
          display: flex;
          align-items: center;

          .form-check {
            display: flex;
            align-items: center;
            padding-left: 1.5rem;
            margin-right: 50px;

            input[type="radio"] {
              width: 20px;
              height: 20px;
              min-width: auto;
              min-height: auto;
              margin-left: -1.5rem;
            }

            label {
              font-size: 14px;
              padding-top: 3px;
            }
          }
        }

        input {
          border-radius: 8px;
          border: solid 1px #e2e2e2;
          background-color: #fff;
          min-width: 240px;
          width: 100%;
          min-height: 40px;
          max-height: 40px;
          padding: 16px;
        }

        span {
          font-size: 14px;
          color: #000;
          margin-bottom: 8px;
        }
      }
    }
  }

  .create--channel__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;

    h3 {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .btn-options {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btn-cancel {
      color: #fff;
    }
  }

  #fileUpload > label {
    margin: 0;
    cursor: pointer;
  }
  #fileUpload > .file-input {
    display: none;
  }
`;

export default CreateChannel;
