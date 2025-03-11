/**
 * Error Boundary Component
 *
 * Catches errors in the component tree and displays a fallback UI.
 * This prevents the whole app from crashing when an error occurs.
 */
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AttentionBox } from "@vibe/core";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <AttentionBox
            title="Application Error"
            text={`Something went wrong. Please try again or contact support.\n\n${
              this.state.error?.message || "Unknown error"
            }`}
            type={AttentionBox.types.DANGER}
          />
        )
      );
    }

    return this.props.children;
  }
}
