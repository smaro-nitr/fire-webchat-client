import React from "react";
import Axios from "axios";
import socketIOClient from "socket.io-client";
import BsNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Props, State } from "./NavbarModel";
import { authorizeUser, getUserLs, setLs } from "util/CrossUtil";
import { API } from "config";

export default class Navbar extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  timer: any;
  autoLogout: any;
  socket: any;

  constructor(props: Props) {
    super(props);
    this.state = {
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

    Notification.requestPermission().then((result) => {
      console.log(result);
    });

    this.initializeAutoLogout();

    this.socket = socketIOClient(API.websocket);
    this.socket.on("child_added", (data: any) => {
      if (data.message === getUserLs().defaultParam.clearTimeMessage) {
        this.setState({ refreshingData: true });
      }
    });
    this.socket.on("child_removed", (data: any) => {
      this.setState({ refreshingData: false });
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

  logout = () => {
    const { history } = this.props;
    Axios.post(`${API.backend}/chat-sign-out`, {
      username: getUserLs().username,
    }).then((response) => {
      setLs("user", "");
      setLs("chatWith", "");
      history.push("/");
      window.location.replace("https://www.youtube.com/");
    });
  };

  render() {
    const { history } = this.props;
    const { refreshingData } = this.state;

    return (
      <BsNavbar
        sticky="top"
        expand="lg"
        variant="dark"
        className="w-100 bg-info"
      >
        <BsNavbar.Brand
          id="brand-title"
          className="font-weight-bold text-white"
          onClick={() => history.push("/contact")}
        >
          Fire Webchat
          {refreshingData && (
            <i className="mx-2 fas fa-spinner fa-spin text-warning"></i>
          )}
        </BsNavbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="#">
            <i
              className="fas fa-power-off pl-3"
              title="logout"
              onClick={this.logout}
            ></i>
          </Nav.Link>
        </Nav>
      </BsNavbar>
    );
  }
}
