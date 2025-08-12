import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error:', error, info);
  }

  render() {
    if (thisState.hasError) {
      return <div className="error">Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}
