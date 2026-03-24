import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Building, ArrowRight, Sparkles, CheckCircle, Briefcase, User, LogOut, LogIn,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Projects } from '../components/Projects';
import { Contact } from '../components/Contact';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRoleSwitchModal, setShowRoleSwitchModal] = useState(false);
  const [targetRole, setTargetRole] = useState<string>('');

  // Ensure HubSpot forms render on the Home page as well
  useEffect(() => {
    function loadHs() {
      // @ts-ignore
      if (window.hbspt) {
        try {
          document.querySelectorAll('.hs-form-frame').forEach((container, i) => {
            const el = container as HTMLElement;
            const portalId = el.getAttribute('data-portal-id') || '145992374';
            const formId = el.getAttribute('data-form-id') || '8a91e9cb-3891-442c-a06a-38894e7eafdb';
            const region = el.getAttribute('data-region') || 'eu1';
            // Clear container before render to avoid duplicates
            el.innerHTML = '';
            // Assign unique id for target selector
            if (!el.id) {
              el.id = `hs-form-${formId}-${i}`;
            }
            // @ts-ignore
            window.hbspt.forms.create({
              region,
              portalId,
              formId,
              target: `#${el.id}`,
              css:
                '.hubspot-link__container, .hs-branding, .hs-form-privacy-policy, .hs-form__branding, .hs_legal_links, .legal-consent-container, .hs-form__powered-by, .hs-form-powered-by, .powered-by { display:none !important; }'
                + '.hs-form .hs-submit .hs-button{ width:100% !important; padding:12px 20px !important; border-radius:16px !important; font-weight:600 !important; font-size:16px !important; color:#fff !important; background-image:linear-gradient(90deg, var(--primary,#0f022d) 0%, var(--accent,#100330) 100%) !important; box-shadow:0 10px 25px -10px rgba(16,3,48,.5) !important; border:0 !important; }'
                + '.hs-form .hs-submit .hs-button:hover{ filter:brightness(1.05) !important; transform:translateY(-1px) !important; }',
              onFormReady($form: any) {
                try {
                  $form.find('.hubspot-link__container, .hs-branding, .hs-form-privacy-policy, .hs-form__branding, .hs_legal_links, .legal-consent-container').remove();
                } catch (_) {}
              },
            });
          });
        } catch (_) {}
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js-eu1.hsforms.net/forms/v2.js';
      script.async = true;
      script.onload = loadHs;
      document.head.appendChild(script);
    }

    loadHs();
    return () => {
      document.querySelectorAll('.hs-form-iframe, iframe[src*="hubspot"]').forEach((n) => n.remove());
    };
  }, []);

  const handleRoleSelection = (role: 'freelancer' | 'company') => {
    if (user) {
      // User is logged in - navigate to their dashboard
      if (user.role.toLowerCase() === role) {
        navigate(`/opportunities/${role}`);
      } else {
        // Different role - show switch modal or redirect
        navigate(`/opportunities/${role}`);
      }
    } else {
      // User not logged in - store preference and navigate to register
      localStorage.setItem('preferredRole', role);
      navigate('/register', { state: { preferredRole: role } });
    }
  };

  const getQuickActions = () => {
    if (!user) return [];

    const role = user.role.toLowerCase();

    if (role === 'freelancer') {
      return [
        { label: 'Browse Opportunities', action: '/opportunities/freelancer', icon: 'Briefcase' },
        { label: 'My Applications', action: '/dashboard/freelancer/applications', icon: 'CheckCircle' },
        { label: 'My Profile', action: '/dashboard/freelancer/profile', icon: 'User' },
      ];
    }
    return [
      { label: 'Post Opportunity', action: '/opportunities/company', icon: 'Building' },
      { label: 'My Opportunities', action: '/dashboard/company/opportunities', icon: 'Briefcase' },
      { label: 'Company Profile', action: '/dashboard/company/profile', icon: 'Building' },
    ];
  };

  const getRoleDisplayInfo = () => {
    if (!user) return { title: '', subtitle: '' };

    const role = user.role.toLowerCase();

    if (role === 'freelancer') {
      return {
        title: `Welcome back, ${user.name}!`,
        subtitle: 'Ready to find your next exciting opportunity?',
      };
    }
    return {
      title: `Welcome back, ${user.name}!`,
      subtitle: 'Manage your opportunities and find talented professionals.',
    };
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section id="home">
        <Hero />
      </section>

      {/* Smart Welcome Section for Logged-in Users */}
      {user && (
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <AnimatedSection className="text-center mb-8" direction="up">
              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 max-w-4xl mx-auto">
                {(() => {
                  const display = getRoleDisplayInfo();
                  return (
                    <>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">
                        {display.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-lg">
                        {display.subtitle}
                      </p>
                    </>
                  );
                })()}
                <div className="flex flex-wrap justify-center gap-4">
                  {getQuickActions().map((action, index) => (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GradientButton
                        onClick={() => navigate(action.action)}
                        className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90"
                      >
                        {React.createElement(getIconComponent(action.icon), { className: 'w-5 h-5 mr-2' })}
                        <span className="ml-2">{action.label}</span>
                      </GradientButton>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Call-to-Action Section for Guest Users */}
      {!user && (
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <AnimatedSection className="text-center mb-8" direction="up">
              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 max-w-4xl mx-auto">
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Join our platform and connect with AI professionals and innovative companies.
                  Create your account to access opportunities, post projects, and grow your network.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <GradientButton
                    onClick={() => navigate('/register')}
                    className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 px-8 py-3 text-lg"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Get Started
                  </GradientButton>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 text-lg border-2 hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Already have an account? <button onClick={() => navigate('/login')} className="text-primary hover:underline">Sign in here</button>
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Role Selection Section - Only show if not logged in */}
      {!user && (
        <section className="py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            {/* Header */}
            <AnimatedSection className="text-center mb-24" direction="up">
              <div className="inline-block mb-6">
                <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Freelancing Platform
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
                Connect with <span className="text-gradient">Opportunities</span>
              </h2>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                Join our freelancing platform to find exciting AI opportunities or post projects for talented professionals.
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
                    <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                      ✅ I'm a Freelancer
                    </h3>
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
                    <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                      🏢 I'm a Company
                    </h3>
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
                    Why Choose Our Platform?
                  </h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Our platform connects talented AI professionals with innovative companies,
                  creating opportunities for growth and collaboration.
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
        </section>
      )}

      {/* About Section */}
      <section id="about">
        <About />
      </section>

      {/* Projects Section */}
      <section id="projects">
        <Projects />
      </section>

      {/* Contact Section */}
      <section id="contact">
        <Contact />
      </section>
    </div>
  );
}

// Helper function to get icon components
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Briefcase,
    CheckCircle,
    User,
    Building,
    LogIn,
    Users,
  };
  return iconMap[iconName] || Briefcase;
};
