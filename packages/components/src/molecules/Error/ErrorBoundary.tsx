import { getNormalisedError } from '@batoanng/utils';
import { Component, PropsWithChildren } from 'react';
import { InPageAlert } from '../Notification';

interface ErrorBoundaryState {
  hasError: boolean;
  heading: string | null;
  message: string | null;
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);

    this.state = {
      hasError: false,
      heading: null,
      message: null,
    };
  }

  static getDerivedStateFromError(error: Error | unknown) {
    const { heading = 'An error has occurred', message } = getNormalisedError(error)!;

    return {
      hasError: true,
      heading,
      message,
    };
  }

  render() {
    const { hasError, heading, message } = this.state;

    if (!hasError) {
      return this.props.children;
    }

    return (
      <InPageAlert variant="error" title={heading!}>
        {message}
      </InPageAlert>
    );
  }
}
