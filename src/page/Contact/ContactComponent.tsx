import React from "react";
import Axios from "axios";
import { Props, State } from "./ContactModel";
import { API } from "config";

export default class Contact extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: [],
    };
  }

  componentDidMount() {
    window.localStorage.setItem("chatWith", "");
    Axios.get(`${API.backend}/chat-user`).then((response) => {
      this.setState({ user: response.data.message });
    });
  }

  startChat = (chatWith: string) => {
    const { history } = this.props;
    window.localStorage.setItem("chatWith", chatWith);
    history.push("/home");
  };

  render() {
    const { user } = this.state;
    const currentUser: any = window.localStorage.getItem("user");

    return (
      <div className="d-flex flex-column flex-fill px-3 my-2 overflow-auto">
          <div> Hi {JSON.parse(currentUser).username}, Wanna chat with .... <br/><br/></div>
          {user.map((e) => {
            if (e.username === JSON.parse(currentUser).username) return null;
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
