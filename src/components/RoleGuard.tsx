import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: 'freelancer' | 'company';
}

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Don't process while loading
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    // If authenticated but no user data, wait
    if (!user) return;

    // Convert database role to lowercase for compatibility
    const userRole = user.role.toLowerCase() as 'freelancer' | 'company';

    // If no role is required, user is authorized
    if (!requiredRole) {
      setIsAuthorized(true);
      return;
    }

    // If a specific role is required and user has a different role, redirect
    if (requiredRole && userRole !== requiredRole) {
      // Convert back to uppercase for database routes
      const redirectRole = userRole === 'freelancer' ? 'freelancer' : 'company';
      navigate(`/opportunities/${redirectRole}`, { replace: true });
      return;
    }

    // User is authorized
    setIsAuthorized(true);
  }, [isAuthenticated, user, requiredRole, isLoading, navigate, location.pathname]);

  // Show loading state while checking authorization
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

  // Don't render children until we've checked authorization
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
