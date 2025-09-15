'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  variant?: 'hero' | 'scene' | 'canvas';
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ThreeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('3D Component Error:', error, errorInfo);
    
    // In production, you could send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const variants = {
        hero: 'h-screen w-full',
        scene: 'h-64 w-full',
        canvas: 'h-full w-full'
      };

      const variant = this.props.variant || 'scene';

      return (
        <div className={`${variants[variant]} relative flex items-center justify-center bg-gradient-to-br from-gray-900 to-black`}>
          <div className="text-center p-8 max-w-md">
            <div className="mb-6">
              <svg 
                className="w-16 h-16 text-red-400 mx-auto mb-4"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">
                3D Content Unavailable
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                The 3D experience couldn&apos;t load. This might be due to device limitations or WebGL not being supported.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
            
            <details className="mt-4 text-left">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs text-red-300 bg-red-900/20 p-2 rounded overflow-auto max-h-32">
                {this.state.error?.message}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
