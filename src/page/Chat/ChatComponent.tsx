import React from "react";
import { Props, State } from "./ChatModel";
import { Button, Form, FormControl, InputGroup, Navbar } from "react-bootstrap";
import { API } from "config";
import { getLs, getUserLs } from "util/CrossUtil";
import { axios } from "util/ApiUtil";
import { socket } from "util/SocketUtil";

export default class Home extends React.Component<Props, State> {
  textMessageEl: any;
  sendMessageEl: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      chatData: [],
    };

    const reciever = getLs("chatWith");
    axios
      .get(`${API.backend}/chat/${reciever}`)
      .then((res) => {
        this.setMessage(res.data);
      })
      .catch((err) => {});
  }

  componentDidMount() {
    this.textMessageEl = document.getElementById("text-message");
    this.sendMessageEl = document.getElementById("send-message");

    socket.on("new-message", (data: any) => {
      this.setMessage(data);
    });

    socket.on("clean-message", (data: any) => {
      this.textMessageEl.disabled = false;
      this.sendMessageEl.disabled = false;
      this.setState({ chatData: data }, () => {
        setTimeout(() => {
          this.textMessageEl.disabled = true;
          this.sendMessageEl.disabled = true;
        }, 3000);
      });
    });
  }

  setMessage = (data: any) => {
    this.setState(
      (prevState) => {
        return { chatData: [...prevState.chatData, ...data] };
      },
      () => {
        document.getElementById("bottom")?.scrollIntoView();
      }
    );
  };

  sendMessage = () => {
    this.textMessageEl.focus();
    this.sendMessageEl.blur();
    const message = this.textMessageEl.value;
    this.textMessageEl.value = "";

    message &&
      !this.textMessageEl.disabled &&
      axios
        .post(`${API.backend}/chat/send`, {
          sender: getUserLs().username,
          reciever: getLs("chatWith"),
          message,
        })
        .then((response) => {
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
