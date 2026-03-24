import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function Terms() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link to="/login">
            <Button variant="outline" className="group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-4xl font-display font-bold text-foreground mb-6">
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-xl mb-6">
              This page is coming soon. We're working on our terms of service to ensure
              a clear and fair experience for all users.
            </p>

            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-accent mb-4">What to Expect</h2>
              <ul className="space-y-2 text-accent/80">
                <li>• Clear user rights and responsibilities</li>
                <li>• Service usage guidelines</li>
                <li>• Privacy and data protection</li>
                <li>• Dispute resolution processes</li>
                <li>• Contact information for legal matters</li>
              </ul>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              For immediate questions about our services, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
