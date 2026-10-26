import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryState { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Frontend render error', error, info.componentStack); }
  render() {
    if (this.state.hasError) return <main className="standalone-state">La pagina no pudo mostrarse. Recarga para intentarlo de nuevo.</main>;
    return this.props.children;
  }
}