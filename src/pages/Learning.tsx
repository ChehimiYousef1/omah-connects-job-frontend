import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Education as EducationComponent } from '../components/Education';
import { GradientButton } from '../components/ui/gradient-button';
import { AnimatedSection } from '../components/ui/animated-section';

export function Learning() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Back to Home */}
      <AnimatedSection className="pt-8 pb-4" direction="up">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-start">
            <GradientButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </GradientButton>
          </div>
        </div>
      </AnimatedSection>

      {/* LMS Content */}
      <EducationComponent />
    </div>
  );
}
