import React from "react";
import PropTypes from "prop-types";
import { getAccessToken } from "services/TokenService";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

export const AuthRoute = ({ children, ...rest }: any) => {
  const token = getAccessToken();
  const onlyChild = React.Children.only(children);
  console.log("token", token);
  return (
    <Route
      {...rest}
      render={(props: any) => {
        return token ? (
          React.cloneElement(onlyChild, { ...rest, ...props })
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};
