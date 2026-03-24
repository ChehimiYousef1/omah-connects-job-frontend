import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building, Users, ArrowRight, Sparkles, CheckCircle, Briefcase,
} from 'lucide-react';
import { useEffect } from 'react';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import { useAuth } from '../contexts/AuthContext';

export function RoleSelection() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Save user info to session storage when component mounts
  useEffect(() => {
    if (user && isAuthenticated) {
      sessionStorage.setItem('userInfo', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      }));
    }
  }, [user, isAuthenticated]);

  const handleRoleSelection = (role: 'freelancer' | 'company') => {
    // Store role preference in localStorage
    localStorage.setItem('userRole', role);
    // Navigate to the appropriate opportunities page
    navigate(`/opportunities/${role}`);
  };

  // Check if user has a stored role preference
  const storedRole = localStorage.getItem('userRole');

  // If user is authenticated, show only their role option
  if (isAuthenticated && user) {
    const userRole = user.role.toLowerCase();

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-32">
          {/* Back to Home */}
          <AnimatedSection className="mb-8" direction="up">
            <div className="flex justify-start">
              <GradientButton
                variant="outline"
                size="sm"
                onClick={() => navigate('/home')}
                className="text-xs"
              >
                ← Back to Home
              </GradientButton>
            </div>
          </AnimatedSection>

          {/* Welcome Message for Authenticated User */}
          <AnimatedSection className="text-center mb-12" direction="up">
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 max-w-2xl mx-auto">
              <p className="text-muted-foreground mb-4">
                Welcome back, <strong className="text-foreground">{user.name}</strong>!
                You're registered as a <strong className="text-foreground">{user.role}</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GradientButton
                  size="sm"
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate(`/opportunities/${userRole}`)}
                >
                  Go to {user.role === 'COMPANY' ? 'Company' : 'Freelancer'} Opportunities
                </GradientButton>
                <GradientButton
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/home')}
                >
                  Back to Dashboard
                </GradientButton>
              </div>
            </div>
          </AnimatedSection>

          {/* Role-Specific Card */}
          <div className="max-w-4xl mx-auto">
            <AnimatedSection direction="up" delay={0.2}>
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/50 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/opportunities/${userRole}`)}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className={`w-20 h-20 ${userRole === 'freelancer' ? 'bg-accent/20' : 'bg-primary/20'} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:${userRole === 'freelancer' ? 'bg-accent/30' : 'bg-primary/30'} transition-colors duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    {userRole === 'freelancer' ? (
                      <Users className="w-10 h-10 text-accent" />
                    ) : (
                      <Building className="w-10 h-10 text-primary" />
                    )}
                  </motion.div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                    {userRole === 'freelancer' ? '✅ I\'m a Freelancer' : '🏢 I\'m a Company'}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {userRole === 'freelancer'
                      ? 'I want to find exciting AI opportunities and projects from top companies.'
                      : 'I want to post opportunities and find talented AI professionals.'
                    }
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {userRole === 'freelancer' ? (
                    <>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        <span className="text-foreground font-medium">Browse opportunities</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        <span className="text-foreground font-medium">Apply to projects</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        <span className="text-foreground font-medium">Connect with companies</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-foreground font-medium">Post opportunities</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-foreground font-medium">Find AI talent</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-foreground font-medium">Manage applications</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 ${userRole === 'freelancer' ? 'text-accent' : 'text-primary'} font-semibold text-lg group-hover:${userRole === 'freelancer' ? 'text-accent/80' : 'text-primary/80'} transition-colors duration-300`}>
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    );
  }

  // Original role selection for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-32">
        {/* Back to Home */}
        <AnimatedSection className="mb-8" direction="up">
          <div className="flex justify-start">
            <GradientButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-xs"
            >
              ← Back to Login
            </GradientButton>
          </div>
        </AnimatedSection>

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

        {/* Header */}
        <AnimatedSection className="text-center mb-24" direction="up">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Choose Your Experience
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
            How would you like to <span className="text-gradient">connect</span>?
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
            Select your role to access the right experience for your needs.
            We'll customize the platform just for you.
          </p>
        </AnimatedSection>

        {/* Role Selection Cards */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-24">
          {/* Freelancer Card */}
          <AnimatedSection direction="up" delay={0.2}>
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
                  I want to find exciting AI opportunities and projects from top companies.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium">Browse opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium">Apply to projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium">Connect with companies</span>
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

          {/* Company Card */}
          <AnimatedSection direction="up" delay={0.4}>
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
                  I want to post opportunities and find talented AI professionals.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">Post opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">Find AI talent</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">Manage applications</span>
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
        </div>

        {/* Info Section */}
        <AnimatedSection className="text-center" direction="up" delay={0.6}>
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-12 shadow-lg border border-white/20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Briefcase className="w-8 h-8 text-accent" />
              <h3 className="text-2xl font-display font-bold text-foreground">
                Why Choose Your Role?
              </h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Your role selection helps us provide you with the most relevant experience.
              You can always switch roles later from any page.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-foreground mb-3">For Freelancers</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Browse and filter opportunities</li>
                  <li>• Apply to projects directly</li>
                  <li>• Get matched with companies</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">For Companies</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Post detailed opportunities</li>
                  <li>• Reach qualified AI talent</li>
                  <li>• Manage applications easily</li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
