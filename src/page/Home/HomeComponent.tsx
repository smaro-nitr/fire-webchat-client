import React from "react";
import Axios from "axios";
import SocketIOClient from "socket.io-client";
import { Props, State } from "./HomeModel";
import { Button, Form, FormControl, InputGroup, Navbar } from "react-bootstrap";
import { API } from "config";
import { getLs, getUserLs } from "util/CrossUtil";

export default class Home extends React.Component<Props, State> {
  socket: any;
  textMessageEl: any;
  sendMessageEl: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      chatData: [],
    };
  }

  componentDidMount() {
    this.textMessageEl = document.getElementById("text-message");
    this.sendMessageEl = document.getElementById("send-message");

    this.socket = SocketIOClient(API.websocket);

    this.socket.on("message_added", (data: any) => {
      const reciever = getLs("chatWith");

      const sender = getUserLs().username;
      const validSender = data.sender === sender || data.sender === reciever;
      const validReciever =
        data.reciever === sender || data.reciever === reciever;

      if (validSender && validReciever) {
        const chatData = JSON.parse(JSON.stringify(this.state.chatData));
        chatData.push(data);
        this.setState({ chatData }, () => {
          document.getElementById("bottom")?.scrollIntoView();
        });
      }

      if (data.message === getUserLs().defaultParam.clearTimeMessage) {
        this.textMessageEl.disabled = true;
        this.sendMessageEl.disabled = true;
      }
    });

    this.socket.on("message_removed", (data: any) => {
      if (data.message === getUserLs().defaultParam.clearTimeMessage) {
        this.textMessageEl.disabled = false;
        this.sendMessageEl.disabled = false;
      }

      this.setState({ chatData: [] });
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  sendMessage = () => {
    this.textMessageEl.focus();
    this.sendMessageEl.blur();
    const message = this.textMessageEl.value;
    this.textMessageEl.value = "";

    message &&
      !this.textMessageEl.disabled &&
      Axios.post(`${API.backend}/chat-send-message`, {
        sender: getUserLs().username,
        reciever: getLs("chatWith"),
        message,
      }).then((response) => {
        this.sendMessageEl.disabled = false;
        document.getElementById("bottom")?.scrollIntoView();
      });
  };

  render() {
    const { chatData } = this.state;
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
                          ? "text-info"
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
            <Form autoComplete="off" className="w-100">
              <InputGroup className="">
                <FormControl
                  id="text-message"
                  placeholder="Type your msg here ..."
                  autoComplete="off"
                />
                <InputGroup.Append>
                  <Button
                    variant="outline-info"
                    type="submit"
                    id="send-message"
                    onClick={(e) => {
                      e.preventDefault();
                      this.sendMessage();
                    }}
                  >
                    &nbsp; <i className="fa fa-paper-plane"></i> &nbsp;
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </Navbar>
        </div>
      </>
    );
  }
}
