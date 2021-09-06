import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import theme from "./common/theme";
import Layout from "./components/Layout/Layout";
import Navigation from "./components/Navigation/Navigation";
import { HostsDataProvider } from "./context/HostContext";
import { WebSocketProvider } from "./context/WebSocket";
import NotificationComponent from "./components/Notifications/NotificationComponent";
import { SnackbarProvider } from "notistack";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const socket = new SockJS("http://localhost:8080/gs-guide-websocket");
  const stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame: any) {
    console.log("Connected: " + frame);
    stompClient.subscribe("/alerts", function (greeting) {
      console.log("AAAAAAAAA");
      console.log(JSON.parse(greeting.body));
    });
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <HostsDataProvider>
          <WebSocketProvider>
            <SnackbarProvider
              maxSnack={4}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <NotificationComponent>
                <CssBaseline />
                <Layout>
                  <Navigation />
                </Layout>
              </NotificationComponent>
            </SnackbarProvider>
          </WebSocketProvider>
        </HostsDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
