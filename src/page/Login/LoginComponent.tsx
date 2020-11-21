import React from "react";
import Axios from "axios";
import md5 from "md5";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { Props, State } from "./LoginModel";
import { API } from "config";
import { getUserLs, resetLs, setLs } from "util/CrossUtil";

export default class Login extends React.Component<Props, State> {
  socket: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: "",
      loginInterface: true,
      formDetail: {
        username: "",
        password: "",
      },
    };
  }

  componentDidMount() {
    resetLs();
  }

  updateForm = (key: string, value: string) => {
    const formDetail = JSON.parse(JSON.stringify(this.state.formDetail));
    formDetail[key] = value;
    this.setState({ formDetail, errorMessage: "" });
  };

  signInOrSignUp = (signIn: boolean) => {
    const { history } = this.props;
    const { formDetail } = this.state;

    Axios.post(`${API.backend}/${signIn ? "chat-sign-in" : "chat-sign-up"}`, {
      username: formDetail.username,
      password: formDetail.password,
    }).then((response) => {
      if (response.data.status === 300) {
        this.setState({ errorMessage: response.data.message });
      } else {
        setLs("user", response.data.message);
        setLs("lastLogin", getUserLs().username);
        history.push("/contact");
      }
    });
  };

  enableSignUp = () => {
    const secretCode: any = document.getElementById("secret-code");
    this.setState({
      formDetail: {
        username: "",
        password: "",
      },
      loginInterface:
        md5(secretCode.value) !== "fb9abce118c6f8c034ec673f9f447870",
    });
  };

  render() {
    const { errorMessage, formDetail, loginInterface } = this.state;

    return (
      <div className="d-flex flex-fill h-100 flex-column justify-content-center align-items-center">
        <Form autoComplete="off">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              value={formDetail.username}
              onChange={(e) => this.updateForm("username", e.target.value)}
              placeholder="Enter username"
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={formDetail.password}
              onChange={(e) => this.updateForm("password", e.target.value)}
              placeholder="Password"
              autoComplete="off"
            />
          </Form.Group>
          <div className="w-100 my-2 text-center text-danger fs-12">
            {errorMessage ? errorMessage : API.version}
          </div>
          <Button
            variant="info"
            className="mt-4 w-100 cursor-pointer"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              this.signInOrSignUp(loginInterface);
            }}
          >
            {loginInterface ? "Sign In" : "Sign Up"}
          </Button>
          <div className="w-100 mt-4 text-center text-muted fs-12">
            <InputGroup className="mb-3">
              <FormControl
                type="password"
                id="secret-code"
                placeholder="Referral"
              />
              <InputGroup.Append onClick={this.enableSignUp}>
                <InputGroup.Text>
                  <i className="fas fa-unlock-alt"></i>
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </Form>
      </div>
    );
  }
}
