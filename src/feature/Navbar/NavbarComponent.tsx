import React from "react";
import Axios from "axios";
import socketIOClient from "socket.io-client";
import BsNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Props, State } from "./NavbarModel";
import { authorizeUser, getLs, getUserLs, setLs } from "util/CrossUtil";
import { API } from "config";

export default class Navbar extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  timer: any;
  autoLogout: any;
  socket: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      activeChat: false,
      refreshingData: false,
    };
  }

  componentDidMount = () => {
    const { history } = this.props;

    if (!authorizeUser()) history.push("/");

    window.addEventListener("mousemove", () => {
      clearInterval(this.autoLogout);
      this.initializeAutoLogout();
    });

    window.addEventListener("beforeunload", () => {
      this.logout();
    });

    window.addEventListener("blur", () => {
      this.logout();
    });

    this.initializeAutoLogout();

    this.socket = socketIOClient(API.websocket);

    this.socket.on("message_added", (data: any) => {
      if (data.message === getUserLs().defaultParam.clearTimeMessage) {
        this.setState({ refreshingData: true });
      }
    });

    this.socket.on("message_removed", (data: any) => {
      this.setState({ refreshingData: false });
    });

    this.socket.on("user_added", (data: any) => {
      if (data.username === getLs("chatWith")) {
        this.setState({ activeChat: data.loggedIn });
      }
    });

    this.socket.on("user_updated", (data: any) => {
      if (data.username === getLs("chatWith")) {
        this.setState({ activeChat: data.loggedIn });
      }
    });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  initializeAutoLogout = () => {
    this.autoLogout = setTimeout(() => {
      this.logout();
    }, 180000);
  };

  rememberSomeone = (remember: string) => {
    Axios.post(`${API.backend}/remember`, {
      remember,
    });
  };

  logout = (exit?: boolean) => {
    const { history } = this.props;
    Axios.post(`${API.backend}/chat-sign-out`, {
      username: getUserLs().username,
    }).then((response) => {
      setLs("user", "");
      setLs("chatWith", "");
      history.push("/");
      // if (exit) window.location.replace("https://www.youtube.com/");
    });
  };

  exit = () => {
    this.logout(true);
  };

  render() {
    const { history } = this.props;
    const { activeChat, refreshingData } = this.state;

    const chatWith = getLs("chatWith");

    return (
      <BsNavbar
        sticky="top"
        expand="lg"
        variant="dark"
        className="w-100 bg-info"
      >
        <BsNavbar.Brand
          id="brand-title"
          className="font-weight-bold text-white fs-20"
        >
          <>
            {chatWith && (
              <i
                onClick={() => {
                  setLs("chatWith", "");
                  history.push("/contact");
                }}
                className="mr-3 fas fa-arrow-left"
              ></i>
            )}
            {chatWith ? chatWith : "Fire Webchat"}
            {refreshingData && (
              <i className="ml-2 fas fa-spinner fa-spin text-white"></i>
            )}
            {chatWith && !refreshingData && (
              <i
                className={`ml-2 fas fa-circle shadow ${
                  activeChat ? "text-success" : "text-warning"
                }`}
              ></i>
            )}
          </>
        </BsNavbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="#">
            {chatWith && (
              <i
                className="fas fa-heartbeat text-danger fs-20 shadow ml-auto"
                onClick={() => this.rememberSomeone(chatWith)}
              ></i>
            )}
            <i
              className="fas fa-power-off pl-3 fs-20 ml-auto"
              title="logout"
              onClick={this.exit}
            ></i>
          </Nav.Link>
        </Nav>
      </BsNavbar>
    );
  }
}
