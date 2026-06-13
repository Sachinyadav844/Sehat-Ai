import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

type Props = { children?: React.ReactNode };

type State = { hasError: boolean; error?: Error };

export class ErrorBoundaryClass extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // log to console and attempt to POST to /api/logs if available
    console.error('Captured error:', error, info);
    try {
      fetch('/api/logs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ error: String(error), info }) });
    } catch (_) {}
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (!this.state.hasError) return this.props.children ?? null;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => this.reset()}
              className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
            <a href="/" className="rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground hover:opacity-90 transition-opacity">Go home</a>
          </div>
        </div>
      </div>
    );
  }
}

export default function ErrorBoundary({ error, reset }: { error?: Error; reset?: () => void }) {
  // Provide functional wrapper for tanstack route errorComponent compatibility
  const navigate = useNavigate();
  const handleRetry = () => {
    if (reset) reset();
    navigate({ to: '/' });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error?.message || 'An unexpected error occurred.'}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={handleRetry} className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">Try again</button>
          <a href="/" className="rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground hover:opacity-90 transition-opacity">Go home</a>
        </div>
      </div>
    </div>
  );
}
