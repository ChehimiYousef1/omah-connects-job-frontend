import { motion } from 'framer-motion';
import {
  Star, ArrowRight, Play, Users, Building, Sparkles, ExternalLink, Briefcase, TrendingUp, DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './ui/animated-section';
import { GradientButton } from './ui/gradient-button';

export const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/opportunities');
  };

  const handleBookDemo = () => {
    navigate('/opportunities');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f022d]">
      {/* Starry Background */}
      <div className="absolute inset-0">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/10 to-background" />

        {/* Starry particles */}
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">

          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <AnimatedSection direction="up" delay={0.2}>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
              >
                <span className="block">Connect with</span>
                <span className="block">
                  <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-gradient">
                    AI Talent
                  </span>
                </span>
                <span className="block">Build the Future</span>
              </motion.h1>
            </AnimatedSection>

            {/* Sub-heading */}
            <AnimatedSection direction="up" delay={0.4}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-xl md:text-2xl text-white/90 font-medium"
              >
                Join our revolutionary freelancing platform where cutting-edge AI professionals
                meet innovative companies to create groundbreaking solutions together.
              </motion.p>
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection direction="up" delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <motion.button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl border-2 border-white hover:from-primary-400 hover:to-accent-400 hover:border-primary-400 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
                <motion.button
                  onClick={handleBookDemo}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:border-accent-400 hover:bg-accent-400/20 hover:text-accent-400 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Find Opportunities
                </motion.button>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="relative flex items-end justify-end">
            <AnimatedSection direction="up" delay={0.6}>
              <div className="flex flex-col gap-6 w-80">
                {[
                  {
                    icon: Briefcase,
                    title: 'Find Jobs',
                    description: 'Discover opportunities',
                    hoverDescription: 'Browse thousands of AI and tech job opportunities from top companies worldwide. Filter by location, salary, and job type to find your perfect match.',
                    color: 'text-white',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Career Growth',
                    description: 'Advance your skills',
                    hoverDescription: 'Access premium courses, certifications, and mentorship programs to accelerate your career in AI, machine learning, and emerging technologies.',
                    color: 'text-white',
                  },
                  {
                    icon: DollarSign,
                    title: 'High Earnings',
                    description: 'Maximize your income',
                    hoverDescription: 'Connect with clients willing to pay premium rates for AI expertise. Average freelancers earn $75-150/hour on our platform.',
                    color: 'text-white',
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary-400 hover:shadow-xl hover:shadow-primary-400/40 hover:scale-105 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <feature.icon className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                      <h3 className="font-bold text-white text-lg">{feature.title}</h3>
                    </div>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};
