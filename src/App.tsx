import LoadingView from "components/Spinner/LoadingView";
import ChannelView from "layouts/Channel";
import ChatView from "layouts/Chat";
import JoinChannel from "layouts/JoinChannel";
import LoginView from "layouts/Login";
import RequestLogin from "layouts/RequestLogin";
import SettingsView from "layouts/Settings";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { getAccessToken } from "services/TokenService";
import StoreProvider from "store/StoreProvider";
import Header from "./components/common/Header";
import useWebSocket, { ReadyState } from "react-use-websocket";
import ProfileView from "layouts/Profile";

export const AuthRoute = ({ children, ...rest }: any) => {
  const token = useSelector(({ auth }) => auth.token);
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

const ContentWrapper = ({ children }: any) => (
  <div className="content-page">{children}</div>
);

function MoeMe() {
  const isOnline = useSelector(({ app }: any) => app.isOnline);
  const isChecking = useSelector(({ auth }: any) => auth.isChecking);
  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch({
      type: "SET_TOKEN_SUCCESS",
    });
  }, [dispatch]);

  if (!isOnline) {
    return (
      <LoadingView message="MoeMe has been disconnected from the internet. Please reconnect...." />
    );
  }

  if (isChecking) {
    return <LoadingView message="Load app..." />;
  }

  return (
    <Router>
      <Header />
      <ContentWrapper>
        <Switch>
          <Route path="/login">
            <LoginView />
          </Route>
          <AuthRoute path="/channel">
            <ChannelView />
          </AuthRoute>
          <AuthRoute path="/channel-detail/:id">
            <ChatView tokenNotification="" />
          </AuthRoute>
          <AuthRoute path="/settings">
            <SettingsView />
          </AuthRoute>
          <Route path="/request-login">
            <RequestLogin />
          </Route>
          <AuthRoute path="/request-join/:id">
            <JoinChannel />
          </AuthRoute>
          <AuthRoute path="/profile">
            <ProfileView  />
          </AuthRoute>
          {/* <Route path="/register">
            <RegisterView />
          </Route>
          <AuthRoute path="/home">
            <HomeView />
          </AuthRoute>
          <AuthRoute path="/channel">
            <ChannelView />
          </AuthRoute>
          <AuthRoute path="/channel-detail/:id">
            <ChatView tokenNotification={tokenNotification} />
          </AuthRoute>
          <AuthRoute path="/private">
            <PrivateView usersRef={usersRef} statusRef={statusRef} />
          </AuthRoute>
          <AuthRoute path="/private-detail/:id">
            <PrivateChat />
          </AuthRoute>
          <AuthRoute path="/profile">
            <ProfileView user={user} />
          </AuthRoute>
          <AuthRoute path="/settings">
            <SettingsView />
          </AuthRoute> */}
          <Redirect path="*" to="/login" />
        </Switch>
      </ContentWrapper>
    </Router>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MoeMe />
    </StoreProvider>
  );
}
