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
  
  // const { sendJsonMessage, readyState, getWebSocket } = useWebSocket(
  //   "wss://moeme-web-dev.aveapp.com",
  //   {
  //     onOpen: () => console.log("opened"),
  //     onMessage: (data) => {
  //       console.log("readyState", readyState);
  //       console.log("data", JSON.parse(data.data));
  //       const message = JSON.parse(data.data);
  //       switch (message?.ptCommand) {
  //         case 65537:
  //           console.log("login", message);
  //           break;
  //         case 262145:
  //           console.log("list message", message);
  //           break;
  //         case 262146:
  //           console.log("message", message);
  //           sendJsonMessage({
  //             ptGroup: 262144,
  //             ptCommand: 262145,
  //             params: {
  //               userId: "test3",
  //             },
  //           });
  //           break;
  //       }
  //     },
  //     shouldReconnect: (closeEvent) => true,
  //     share: true,
  //   }
  // );

  // const handleOnLoginSocket = (data: any) => {
  //   sendJsonMessage({
  //     ptCommand: 65537,
  //     ptGroup: 65536,
  //     params: {
  //       deviceType: "web",
  //       userId: data.userId,
  //       userPassword: data.userPassword,
  //     },
  //   });
  // };

  // useEffect(() => {
  //   const tokenmess = requestForToken();

  //   tokenmess
  //     .then((currentToken) => {
  //       if (currentToken) {
  //         console.log("current token for client: ", currentToken);
  //         setTokenNotification(currentToken);
  //         // Perform any other neccessary action with the token
  //       } else {
  //         // Show permission request UI
  //         console.log(
  //           "No registration token available. Request permission to generate one."
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("An error occurred while retrieving token. ", err);
  //     });
  // }, []);

  // useEffect(() => {
  //   connectedRef.on("value", (snap) => {
  //     if (user && user?.uid && snap.val()) {
  //       copyRef.on("child_added", (snap: any) => {
  //         console.log("snap.val()", snap.val());
  //         if (snap.val()?.id) {
  //           console.log("co id");
  //           window.location.href = `/#${snap.val().url}`;
  //           // https://baophung020394.github.io/waveasean-moeme-2/#/channel-detail/-NQ8L82ow2YFNh0tAz7P
  //         } else {
  //           console.log("k co id");
  //           // window.location.href = `/#/`;
  //         }
  //       });

  //       const userStatusRef = statusRef.child(user?.uid);
  //       userStatusRef.set(true);

  //       userStatusRef.onDisconnect().remove();
  //     }
  //   });

  //   return () => {
  //     usersRef.off();
  //     connectedRef.off();
  //   };
  // }, [user]);

  // useEffect(() => {
  //   const unsubFromAuth = dispatch(listenToAuthChanges());
  //   const unsubFromConnection = dispatch(listenToConnectionChanges());

  //   return () => {
  //     unsubFromAuth();
  //     unsubFromConnection();
  //   };
  // }, [dispatch]);

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
