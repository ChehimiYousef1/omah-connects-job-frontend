// src/components/GlobalErrorBoundary.tsx
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: string
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console
    console.error('Frontend Error:', error, errorInfo)
    // Optionally: send to a backend logging endpoint
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: 10 }}>
          <strong>Frontend Error:</strong> {this.state.errorMessage}
        </div>
      )
    }

    return this.props.children
  }
}
