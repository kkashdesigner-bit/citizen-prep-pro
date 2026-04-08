import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Suppress known non-fatal DOM manipulation errors (browser extensions, framer-motion race conditions)
    const msg = error.message || '';
    if (
      msg.includes('insertBefore') ||
      msg.includes('removeChild') ||
      msg.includes('not a child of this node')
    ) {
      console.warn('[ErrorBoundary] Suppressed DOM error:', msg);
    } else {
      console.error('[ErrorBoundary]', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f3f4f6' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '40px 32px', maxWidth: 420, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 12px', color: '#1a1a1a', fontSize: 20 }}>Une erreur est survenue</h2>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 24px', lineHeight: 1.5 }}>Veuillez rafraîchir la page pour continuer.</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              style={{ background: '#0055A4', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
