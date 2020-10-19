import React from "react";
import Axios from "axios";
import BsNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Props, State } from "./NavbarModel";
import {
  authorizeUser,
  getChatClear,
  getReadbleTime,
  getUserLs,
  setLs,
} from "util/CrossUtil";
import { API } from "config";

export default class Navbar extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  timer: any;
  autoLogout: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      timeLeftToRefresh: getChatClear(),
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
    let timeLeftToRefresh = getChatClear();

    this.timer = setInterval(() => {
      timeLeftToRefresh -= 1;
      if (timeLeftToRefresh < 0) timeLeftToRefresh = 300;
      this.setState({ timeLeftToRefresh }, () =>
        setLs("chatClear", timeLeftToRefresh.toString())
      );
    }, 1000);
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
    // const { history } = this.props;
    Axios.post(`${API.backend}/chat-sign-out`, {
      username: getUserLs().username,
    }).then((response) => {
      setLs("user", "");
      setLs("chatWith", "");
      window.location.replace("https://www.youtube.com/");
      // history.push("/");
    });
  };

  render() {
    const { history } = this.props;
    const { timeLeftToRefresh } = this.state;

    return (
      <BsNavbar
        sticky="top"
        expand="lg"
        variant="dark"
        className="w-100 bg-success"
      >
        <BsNavbar.Brand
          id="brand-title"
          className="font-weight-bold"
          onClick={() => history.push("/contact")}
        >
          Fire Webchat
        </BsNavbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="#">
            <span className="text-white">
              {getReadbleTime(timeLeftToRefresh)}
            </span>
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
