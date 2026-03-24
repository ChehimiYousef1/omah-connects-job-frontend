import { motion } from 'framer-motion';
import {
  CheckCircle, Users, Award, Clock, Building, Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './ui/animated-section';
import { GradientButton } from './ui/gradient-button';

export function About() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, number: '1000+', label: 'AI Professionals' },
    { icon: Building, number: '500+', label: 'Companies' },
    { icon: Briefcase, number: '2000+', label: 'Projects Completed' },
  ];

  const features = [
    'Connect talented AI professionals with innovative companies',
    'AI-powered matching for optimal project-talent fit',
    'Secure platform with enterprise-grade protection',
    'Streamlined project management and communication tools',
    'Comprehensive support and dispute resolution',
    'Continuous platform improvements and new features',
  ];

  const handleGetStarted = () => {
    navigate('/opportunities');
  };

  return (
    <section id="about" className="py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <AnimatedSection direction="up">
              <div className="inline-block mb-8">
                <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg">
                  About Our Platform
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
                Connecting <span className="text-gradient">AI Talent</span>
              </h2>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed font-medium">
                We're building the world's leading platform for AI professionals and companies
                to connect, collaborate, and create groundbreaking solutions together.
              </p>

              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Our mission is to bridge the gap between talented AI professionals and innovative
                companies, making it easier than ever to find the right opportunities and the right talent.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-base leading-relaxed">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              <GradientButton
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 font-bold px-12 py-6 text-xl shadow-glow-lg"
                onClick={handleGetStarted}
              >
                Join Our Platform
              </GradientButton>
            </AnimatedSection>
          </div>

          {/* Stats */}
          <AnimatedSection direction="up" delay={0.2}>
            <div className="space-y-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                  className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20 shadow-xl"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-4xl font-display font-black text-foreground mb-2">
                        {stat.number}
                      </div>
                      <div className="text-muted-foreground text-lg font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Mission Statement */}
        <AnimatedSection className="mt-32 text-center" direction="up" delay={0.4}>
          <div className="bg-gradient-primary rounded-3xl p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-display font-black mb-8">
                Our Mission
              </h3>
              <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed font-medium">
                To democratize access to AI opportunities and talent, creating a global ecosystem
                where innovation thrives and where every AI professional can find their next
                breakthrough project.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
