import React from "react";

import { Props, State } from "./ErrorBoundaryModel";

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-row flex-fill justify-content-center align-items-center fs-20">
          <i className="fas fa-skull-crossbones text-danger"></i>
          <span className="px-2 text-danger">Something went wrong</span>
        </div>
      );
    }

    return this.props.children;
  }
}
