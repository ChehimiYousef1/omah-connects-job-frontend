import { motion } from 'framer-motion';
import {
  Mail, MapPin, Clock, MessageSquare, Users, Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './ui/animated-section';
import { GradientButton } from './ui/gradient-button';

export function Contact() {
  const navigate = useNavigate();

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@aifreelance.com',
      href: 'mailto:support@aifreelance.com',
      description: 'Get help with your account or projects',
    },

    {
      icon: MapPin,
      title: 'Headquarters',
      value: 'Beirut, Lebanon',
      href: '#',
      description: 'Visit our main office',
    },
    {
      icon: Clock,
      title: 'Response Time',
      value: '< 2 hours',
      href: '#',
      description: 'We\'ll get back to you quickly',
    },
  ];

  const handleGetStarted = () => {
    navigate('/opportunities');
  };

  return (
    <section id="contact" className="py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <AnimatedSection className="text-center mb-24" direction="up">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg">
              Get In Touch
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
            Need <span className="text-gradient">Help?</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
            Our support team is here to help you get the most out of our platform.
            Whether you're a freelancer or a company, we're ready to assist you.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* HubSpot Contact Form */}
          <AnimatedSection direction="up" delay={0.2}>
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-foreground">
                    Contact Support
                  </h3>
                  <p className="text-muted-foreground">
                    We're here to help you succeed
                  </p>
                </div>
              </div>

              {/* HubSpot Form */}
              <div className="relative overflow-hidden rounded-2xl">
                <div
                  className="hs-form-frame custom-hubspot-form"
                  data-region="eu1"
                  data-form-id="8a91e9cb-3891-442c-a06a-38894e7eafdb"
                  data-portal-id="145992374"
                ></div>
                {/* White overlay to hide HubSpot footer/branding */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-white rounded-b-2xl z-10 flex items-center justify-center">
                  <span className="text-gradient text-lg md:text-xl font-display font-semibold tracking-tight">Contact OMAH — We’d love to hear from you</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Information */}
          <AnimatedSection direction="up" delay={0.4}>
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20 shadow-xl"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-semibold text-foreground mb-2">
                        {info.title}
                      </h4>
                      <a
                        href={info.href}
                        className="text-lg text-primary hover:text-primary/80 transition-colors duration-200 font-medium block mb-2"
                      >
                        {info.value}
                      </a>
                      <p className="text-muted-foreground text-base">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Platform Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="bg-gradient-primary rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <h4 className="text-2xl font-display font-bold mb-4">
                    Why Choose Our Platform?
                  </h4>
                  <ul className="space-y-3 text-white/95">
                    <li className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-accent" />
                      <span>Connect with 1000+ AI professionals</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-accent" />
                      <span>Secure and reliable platform</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>AI-powered matching for optimal results</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>24/7 support and dispute resolution</span>
                    </li>
                  </ul>

                  <div className="mt-8">
                    <GradientButton
                      variant="secondary"
                      size="lg"
                      className="bg-white text-primary hover:bg-white/95 font-bold px-8 py-4"
                      onClick={handleGetStarted}
                    >
                      Get Started Today
                    </GradientButton>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
