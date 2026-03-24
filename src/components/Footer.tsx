import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Github,
} from 'lucide-react';
import { GradientButton } from './ui/gradient-button';
import LogoV1 from '../assets/SVG/Logo v1.svg';
import { SOCIAL_LINKS } from '../constants/socialLinks.ts';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <img src={LogoV1} alt="OpenAI Hamburg Logo" className="w-60 h-60" />
              <div className="text-3xl font-display font-bold text-gradient">
                OpenAI Hamburg
              </div>
            </div>
            <p className="text-muted-foreground mb-8 max-w-md leading-relaxed text-lg">
              We help businesses leverage artificial intelligence to drive innovation,
              increase efficiency, and achieve sustainable growth in the digital age.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, label: 'LinkedIn' },
                { icon: Twitter, href: SOCIAL_LINKS.TWITTER, label: 'Twitter' },
                { icon: Github, href: SOCIAL_LINKS.GITHUB, label: 'GitHub' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300 shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-display font-semibold text-foreground mb-6">
              Services
            </h3>
            <ul className="space-y-4">
              {[
                'AI Strategy & Consulting',
                'Workflow Automation',
                'Predictive Analytics',
                'NLP & Communication',
                'Business Intelligence',
                'Training & Upskilling',
              ].map((service, index) => (
                <li key={index}>
                  <a
                    href="#services"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-base"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-display font-semibold text-foreground mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-muted-foreground">
                <Mail className="w-5 h-5 mr-4 text-accent" />
                <a href={`mailto:${SOCIAL_LINKS.EMAIL}`} className="hover:text-primary transition-colors duration-200 text-base">
                  {SOCIAL_LINKS.EMAIL}
                </a>
              </li>

              <li className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-4 text-accent" />
                <span className="text-base">Beirut, Lebanon</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-primary rounded-3xl p-12 text-white text-center shadow-2xl"
        >
          <h3 className="text-3xl font-display font-bold mb-6 text-white">
            Stay Updated
          </h3>
          <p className="text-white/95 mb-8 max-w-md mx-auto text-lg">
            Get the latest insights on AI trends and business transformation delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
            />
            <GradientButton
              variant="secondary"
              size="md"
              className="bg-white text-white hover:bg-white/95 font-semibold shadow-lg border-2 border-white/20 hover:border-white/40 transition-all duration-200"
            >
              Subscribe
            </GradientButton>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
