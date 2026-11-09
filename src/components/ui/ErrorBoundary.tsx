import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log error info here or send to monitoring
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          role="alert"
          className="rounded-card border border-line px-6 py-10 text-center"
        >
          <h2 className="text-[15px] font-semibold text-ink">
            Something went wrong.
          </h2>
          <p className="mt-1 text-[13px] text-danger">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            className="mt-4 inline-flex h-9 cursor-pointer items-center rounded-control border border-line bg-surface px-3.5 text-[13px] font-medium text-ink hover:bg-background-light"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
