import React from "react";
import SocketIOClient from "socket.io-client";
import BsNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Props, State } from "./NavbarModel";
import { authorizeUser } from "util/CrossUtil";
import { getLs, getUserLs, setLs } from "util/CrossUtil";
import { API } from "config";
import { axios } from "util/ApiUtil";

export default class Navbar extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  socket: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      activeChat: [],
    };
  }

  componentDidMount = () => {
    const { history } = this.props;

    if (!authorizeUser()) history.push("/");

    this.socket = SocketIOClient(API.websocket);

    this.fetchActiveUser();

    this.socket.on("user-update", (data: any) => {
      this.fetchActiveUser();
    });

    this.socket.on("sign-out", (data: any) => {
      if (getLs("user") === data.data) {
        setLs("user", "");
        setLs("chatWith", "");
        history.push("/");
      }
    });
  };

  componentWillUnmount() {
    this.socket.close();
  }

  fetchActiveUser = () => {
    axios
      .get(`${API.backend}/user/active`)
      .then((res) => {
        this.setState({ activeChat: res.data });
      })
      .catch((err) => {});
  };

  logout = () => {
    const { history } = this.props;
    axios
      .post(`${API.backend}/login/sign-out`, {
        username: getUserLs().username,
      })
      .then((response) => {
        if (getLs("user") === response.data) {
          setLs("user", "");
          setLs("chatWith", "");
          history.push("/");
        }
      });
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
                  activeChat.includes(chatWith)
                    ? "text-success"
                    : "text-warning"
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
              onClick={this.logout}
            ></i>
          </Nav.Link>
        </Nav>
      </BsNavbar>
    );
  }
}
