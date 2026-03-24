import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasRun = useRef(false); // Prevent double execution

  useEffect(() => {
    // Prevent running twice in React StrictMode
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    console.log('GitHub Callback - Code:', code);
    console.log('GitHub Callback - Error:', error);

    if (error) {
      console.error('GitHub OAuth error:', error);
      navigate('/login?error=github_auth_failed');
      return;
    }

    if (code) {
      handleCallback(code);
    } else {
      console.error('No code received');
      navigate('/login');
    }
  }, []); // Empty deps - only run once

  const handleCallback = async (code: string) => {
    console.log('Sending code to backend:', code);
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/github/callback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('Auth successful, redirecting to feed');
        window.location.href = '/social/feed';
      } else {
        console.error('Auth failed:', data.error);
        navigate('/login?error=auth_failed');
      }
    } catch (error) {
      console.error('Network error:', error);
      navigate('/login?error=network_error');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p>Authenticating with GitHub...</p>
    </div>
  );
}