import Button from "components/common/Header/Button";
import { withBaseLayout } from "layouts/Base";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { styled } from "utils/styled-component";

function Settings() {
  const dispatch: any = useDispatch();
  const handleLogout = () => {
    localStorage.clear();
    dispatch({type:"SET_TOKEN_NULL"});
  };

  return (
    <SettingsStyled>
      <h1>Settings page</h1>
      <Button
        type="button"
        name="Logout"
        className="btn-login"
        inputColor="primary"
        onClick={handleLogout}
      ></Button>
    </SettingsStyled>
  );
}

const SettingsStyled = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
`;

export default withBaseLayout(Settings);
