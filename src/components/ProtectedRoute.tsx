import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'FREELANCER' | 'COMPANY';
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      // Save the attempted location to redirect after login
      navigate('/login', {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    // If user is authenticated but doesn't have the required role
    if (isAuthenticated && user && requiredRole && user.role !== requiredRole) {
      // Redirect to their appropriate dashboard
      const redirectPath = user.role === 'FREELANCER'
        ? '/opportunities/freelancer'
        : '/opportunities/company';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, requiredRole, requireAuth, isLoading, navigate, location.pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and auth is required, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If authenticated but wrong role, don't render children
  if (isAuthenticated && user && requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
