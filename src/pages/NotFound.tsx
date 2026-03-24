import { Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-body mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
          <Link to="/login">
            <Button className="group">
              <Home size={16} className="mr-2 group-hover:scale-110 transition-transform" />
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
