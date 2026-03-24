import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building, Users, ArrowRight, Briefcase, Search, Sparkles, Target,
} from 'lucide-react';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';

export function Opportunities() {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'freelancer' | 'company') => {
    // Store role preference in localStorage for future use
    localStorage.setItem('userRole', role);
    navigate(`/opportunities/${role}`);
  };

  // Check if user has a stored role preference
  const storedRole = localStorage.getItem('userRole');
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-32">
        {/* Quick Access for Returning Users */}
        {storedRole && (
          <AnimatedSection className="text-center mb-12" direction="up">
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 max-w-2xl mx-auto">
              <p className="text-muted-foreground mb-4">
                Welcome back! You previously selected the <strong className="text-foreground">{storedRole}</strong> experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GradientButton
                  size="sm"
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate(`/opportunities/${storedRole}`)}
                >
                  Continue as {storedRole === 'company' ? 'Company' : 'Freelancer'}
                </GradientButton>
                <GradientButton
                  variant="outline"
                  size="sm"
                  onClick={() => localStorage.removeItem('userRole')}
                >
                  Choose Different Role
                </GradientButton>
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection className="text-center mb-24" direction="up">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Choose Your Path
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
            Are you a <span className="text-gradient">Freelancer</span> or a <span className="text-gradient">Company</span>?
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
            Select your role below to access the right experience for your needs.
            We'll customize the platform just for you.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* For Companies */}
          <AnimatedSection direction="up" delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.02, y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/50 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleRoleSelection('company')}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <Building className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                  🏢 I'm a Company
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Post opportunities and connect with talented AI professionals.
                  Find the perfect match for your projects and drive innovation.
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Post Opportunities</h3>
                    <p className="text-muted-foreground text-sm">Create detailed job postings with requirements and budget</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Reach Qualified Talent</h3>
                    <p className="text-muted-foreground text-sm">Connect with AI professionals who match your requirements</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Manage Applications</h3>
                    <p className="text-muted-foreground text-sm">Review and manage applications from interested candidates</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-primary font-semibold text-lg group-hover:text-primary/80 transition-colors duration-300">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          </AnimatedSection>

          {/* For Freelancers */}
          <AnimatedSection direction="up" delay={0.4}>
            <motion.div
              whileHover={{ scale: 1.02, y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/50 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleRoleSelection('freelancer')}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/30 transition-colors duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <Users className="w-10 h-10 text-accent" />
                </motion.div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                  ✅ I'm a Freelancer
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Discover exciting AI opportunities from top companies.
                  Find projects that match your skills and career goals.
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Browse Opportunities</h3>
                    <p className="text-muted-foreground text-sm">Search and filter through hundreds of AI opportunities</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Match Your Skills</h3>
                    <p className="text-muted-foreground text-sm">Find opportunities that align with your expertise and experience</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Apply Directly</h3>
                    <p className="text-muted-foreground text-sm">Connect with companies and apply to opportunities seamlessly</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-accent font-semibold text-lg group-hover:text-accent/80 transition-colors duration-300">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>

        {/* Stats Section */}
        <AnimatedSection className="mt-32 text-center" direction="up" delay={0.6}>
          <div className="bg-gradient-primary rounded-3xl p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-display font-black mb-8">
                Trusted by Thousands
              </h3>
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
                Join our thriving ecosystem where companies find the perfect AI talent
                and professionals discover exciting opportunities.
              </p>
              <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                <div>
                  <div className="text-4xl font-display font-black mb-2">500+</div>
                  <div className="text-white/90 text-lg">Companies</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-black mb-2">2,000+</div>
                  <div className="text-white/90 text-lg">AI Professionals</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-black mb-2">1,500+</div>
                  <div className="text-white/90 text-lg">Opportunities</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-black mb-2">95%</div>
                  <div className="text-white/90 text-lg">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer Section */}
        <AnimatedSection className="mt-24 text-center" direction="up" delay={0.8}>
          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground text-lg mb-8">
              Not sure which path to choose?
              <button
                onClick={() => localStorage.removeItem('userRole')}
                className="text-primary hover:text-primary/80 underline ml-2 transition-colors duration-300"
              >
                Reset your selection
              </button>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
              <span>Need help? Contact our support team</span>
              <span>•</span>
              <span>Read our FAQ</span>
              <span>•</span>
              <span>View success stories</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
