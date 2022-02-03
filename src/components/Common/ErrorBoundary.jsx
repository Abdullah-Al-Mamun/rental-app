import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // errorService.log({ error, errorInfo });
  }

  triggerError = ({ error, errorInfo }) => {
    // errorService.log({ error, errorInfo });
    this.setState({ hasError: true });
  };

  resetError = () => this.setState({ hasError: false });
  
  render() {
    if (this.state.hasError) return <h1>Oops, we done goofed up</h1>;
    return this.props.children;
  }
}

export default ErrorBoundary