export interface Props {
  history: any
}

export interface State {
  errorMessage: string
  loginInterface: boolean
  formDetail: {
    username: string,
    password: string
  }
}