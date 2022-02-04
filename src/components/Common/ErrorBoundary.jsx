import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
  }

  triggerError = ({ error, errorInfo }) => {
    this.setState({ hasError: true });
  };

  resetError = () => this.setState({ hasError: false });
  
  render() {
    if (this.state.hasError) return <h1>Oops, something went wrong please try again</h1>;
    return this.props.children;
  }
}

export default ErrorBoundary
