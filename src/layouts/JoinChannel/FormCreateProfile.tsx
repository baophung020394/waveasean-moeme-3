import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal } from "semantic-ui-react";
import * as yup from "yup";

interface FormCreateProfileProps {
  isOpenCreate: boolean;
  handleCloseCreate: () => void;
  handleOpenCreate: () => void;
  handleOpenConfirmProfile: () => void;
  onSubmits: (data: any) => void;
}

const schema = yup
  .object({
    roomUserName: yup.string().max(15, "Only 15 words"),
  })
  .required();

function FormCreateProfile({
  isOpenCreate,
  handleCloseCreate,
  handleOpenCreate,
  handleOpenConfirmProfile,
  onSubmits,
}: FormCreateProfileProps) {
  const [value, setValue] = useState<string>("");
  const { handleSubmit, register } = useForm();

  const onSubmit = (data: any) => {
    console.log("data", data);
    data.roomUserName = value;
    if (!onSubmits) return;
    onSubmits(data);
    handleCloseCreate();
    handleOpenConfirmProfile();
  };

  return (
    <Modal
      className="modal-create-profile"
      onClose={handleCloseCreate}
      onOpen={handleOpenCreate}
      open={isOpenCreate}
    >
      <Modal.Header>Nick name</Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content>
          <Modal.Description>
            <input
              type="text"
              className={`modal-create-profile__input ${
                value?.length >= 15 ? "text-danger border-danger" : ""
              }`}
              name="roomUserName"
              {...register("roomUserName")}
              maxLength={15}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              placeholder="1 - 15 words"
            />
            {value?.length >= 15 && (
              <p className="alert alert-danger" role="alert">
                Please input 1 - 15 words
              </p>
            )}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button type="button" onClick={handleCloseCreate} secondary>
            Cancel
          </Button>
          <Button type="submit" primary>
            Create
          </Button>
        </Modal.Actions>
      </form>

      {/* <Modal
        onClose={() => setSecondOpen(false)}
        open={secondOpen}
        size="small"
      >
        <Modal.Header>Modal #2</Modal.Header>
        <Modal.Content>
          <p>That's everything!</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            icon="check"
            content="All Done"
            onClick={() => setSecondOpen(false)}
          />
        </Modal.Actions>
      </Modal> */}
    </Modal>
  );
}

export default FormCreateProfile;
