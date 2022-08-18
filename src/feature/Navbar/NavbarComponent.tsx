import React from "react";
import Axios from "axios";
import SocketIOClient from "socket.io-client";
import BsNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Props, State } from "./NavbarModel";
import { authorizeUser, getLs, getUserLs, setLs } from "util/CrossUtil";
import { API } from "config";

export default class Navbar extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  autoLogout: any;
  socket: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      activeChat: false,
    };

    this.fetchUserList();
  }

  componentDidMount = () => {
    const { history } = this.props;

    if (!authorizeUser()) history.push("/");

    // window.addEventListener("mousemove", () => {
    //   clearInterval(this.autoLogout);
    //   this.initializeAutoLogout();
    // });

    // window.addEventListener("beforeunload", () => {
    //   this.logout();
    // });

    // window.addEventListener("blur", () => {
    //   this.logout();
    // });

    this.initializeAutoLogout();

    this.socket = SocketIOClient(API.websocket);

    this.socket.once("user-update", (data: any) => {
      this.fetchUserList();
    });
  };

  fetchUserList = () => {
    Axios.get(`${API.backend}/user`)
      .then((res) => {
        const chatWith = getLs("chatWith");
        if (chatWith) {
          const currentUser = res.data.filter(
            (item: any) => item.username === getLs("chatWith")
          );
          this.setState({ activeChat: currentUser[0].loggedIn });
        }
      })
      .catch((err) => {});
  };

  componentWillUnmount() {
    this.socket.close();
  }

  initializeAutoLogout = () => {
    this.autoLogout = setTimeout(() => {
      this.logout();
    }, 180000);
  };

  logout = (exit?: boolean) => {
    const { history } = this.props;
    Axios.post(`${API.backend}/login/sign-out`, {
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
    const { activeChat } = this.state;

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
            {chatWith && (
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
