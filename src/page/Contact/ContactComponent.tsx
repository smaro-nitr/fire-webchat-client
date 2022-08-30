import React from "react";
import { Props, State } from "./ContactModel";
import { API } from "config";
import { getUserLs, setLs } from "util/CrossUtil";
import { axios } from "util/ApiUtil";
import { socket } from "util/SocketUtil";

export default class Contact extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: [],
    };
  }

  componentDidMount() {
    setLs("chatWith", "");

    this.fetchUserList();

    socket.on("user-update", (data: any) => {
      this.fetchUserList();
    });
  }

  fetchUserList = () => {
    axios
      .get(`${API.backend}/user`)
      .then((res) => {
        axios
          .get(`${API.backend}/user/active`)
          .then((res2) => {
            const user = JSON.parse(JSON.stringify(res.data));
            const userWithStatus = user.map((item: any) => {
              item.loggedIn = (res2.data || []).includes(item.username);
              return item;
            });
            this.setState({ user: userWithStatus });
          })
          .catch((err2) => {});
      })
      .catch((err) => {});
  };

  startChat = (chatWith: string) => {
    const { history } = this.props;
    setLs("chatWith", chatWith);
    history.push("/home");
  };

  render() {
    const { user } = this.state;
    const currentUser = getUserLs();

    return (
      <div className="d-flex flex-column flex-fill px-3 my-2 overflow-auto">
        <div>
          Hi {currentUser.username}, Wanna chat with .... <br />
          <br />
        </div>
        {user.map((e) => {
          if (e.username === currentUser.username) return null;
          return (
            <div
              key={e.username}
              className="d-flex flex-row small py-2 border-bottom cursor-pointer"
              onClick={() => this.startChat(e.username)}
            >
              <div className="font-weight-bold">
                <i
                  className={`mr-2 fas fa-circle ${
                    e.loggedIn ? "text-success" : "text-warning"
                  }`}
                ></i>
                {e.username}
              </div>
              <div className="ml-auto text-muted">
                <i className="fas fa-eye mx-2"></i> {e.lastLogin}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
