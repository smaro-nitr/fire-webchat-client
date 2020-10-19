import React from "react";
import Axios from "axios";
import socketIOClient from "socket.io-client";
import { Props, State } from "./HomeModel";
import { Button, FormControl, InputGroup, Navbar } from "react-bootstrap";
import { API } from "config";
import { getLs, getUserLs } from "util/CrossUtil";

export default class Home extends React.Component<Props, State> {
  showNotification: any;
  socket: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      chatData: [],
      message: "",
    };
  }

  componentDidMount() {
    window.addEventListener("blur", () => {
      this.showNotification = true;
    });

    window.addEventListener("focus", () => {
      this.showNotification = false;
    });

    this.socket = socketIOClient(API.websocket);
    this.socket.on("child_added", (data: any) => {
      const reciever = getLs("chatWith");
      const chatData = JSON.parse(JSON.stringify(this.state.chatData));

      const sender = getUserLs().username;
      const validSender = data.sender === sender || data.sender === reciever;
      const validReciever =
        data.reciever === sender || data.reciever === reciever;

      if (validSender && validReciever) {
        chatData.push(data);
        this.setState({ chatData }, () => {
          const bottomEl: any = document.getElementById("bottom");
          bottomEl && bottomEl.scrollIntoView();

          if (this.showNotification) {
            new Notification(`Hi ${sender}`, { body: "New Message Arrived" });
          }
        });
      }
    });

    this.socket.on("child_removed", (data: any) => {
      this.setState({ chatData: [] });
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  setMessage = (message: string) => {
    this.setState({ message });
  };

  sendMessage = () => {
    const { message } = this.state;
    message &&
      Axios.post(`${API.backend}/chat-send-message`, {
        sender: getUserLs().username,
        reciever: getLs("chatWith"),
        message,
      }).then((response) => {
        this.setState({ message: "" });
      });
  };

  render() {
    const { chatData, message } = this.state;
    const currentUser = getUserLs();

    return (
      <>
        <div className="d-flex flex-row flex-fill px-3 overflow-auto">
          <div className="w-100 my-2">
            {chatData.map((e, index) => {
              return (
                <div
                  key={index.toString()}
                  className={`${
                    e.sender === currentUser.username
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {(index > 0
                    ? chatData[index - 1].sender !== e.sender
                    : true) && (
                    <span
                      className={`small font-weight-bold ${
                        e.sender === currentUser.username
                          ? "text-success"
                          : "text-primary"
                      }`}
                    >
                      {e.sender}
                      <br />
                    </span>
                  )}
                  {`${e.message} `}
                  <span className="small text-muted fs-10">{e.timeStamp}</span>
                </div>
              );
            })}
            <br />
            <div id="bottom" className="mt-2">
              &nbsp;
            </div>
          </div>
        </div>
        <div className="d-flex flex-row">
          <Navbar bg="light" variant="light" fixed="bottom">
            <InputGroup className="">
              <FormControl
                value={message}
                placeholder="Type your msg here ..."
                onChange={(e) => this.setMessage(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-success" onClick={this.sendMessage}>
                  Send
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Navbar>
        </div>
      </>
    );
  }
}
