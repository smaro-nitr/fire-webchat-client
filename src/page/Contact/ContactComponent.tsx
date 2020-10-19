import React from "react";
import Axios from "axios";
import { Props, State } from "./ContactModel";
import { API } from "config";
import { getUserLs, setLs } from "util/CrossUtil";

export default class Contact extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: [],
    };
  }

  componentDidMount() {
    setLs("chatWith", "");
    Axios.get(`${API.backend}/chat-user`).then((response) => {
      this.setState({ user: response.data.message });
    });
  }

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
          <div> Hi {currentUser.username}, Wanna chat with .... <br/><br/></div>
          {user.map((e) => {
            if (e.username === currentUser.username) return null;
            return (
              <div
                key={e.username}
                className="d-flex flex-row small py-2 border-bottom"
                onClick={() => this.startChat(e.username)}
              >
                <div className="font-weight-bold">
                  <i className="far fa-comments"></i> {e.username}
                </div>
                <div className="ml-auto text-muted">
                  <i className="far fa-clock"></i> {e.lastLogin}
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}
