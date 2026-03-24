import { motion } from 'framer-motion';
import {
  ExternalLink, Github, Eye, Calendar, Users, Star, Building, TrendingUp, DollarSign, Award, Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './ui/animated-section';
import { AnimatedCard } from './ui/animated-card';
import { GradientButton } from './ui/gradient-button';

export function Projects() {
  const navigate = useNavigate();

  const successStories = [
    {
      name: 'Sarah Chen',
      role: 'Senior AI Engineer',
      title: 'From $60K to $150K in 8 Months',
      description: 'Sarah landed her dream AI engineering role at Google through our platform. She went from a junior developer earning $60K to a senior position earning $150K after completing 3 successful ML projects.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=600&h=400',
      tags: ['Machine Learning', 'Google', 'Career Growth', 'Salary Increase'],
      stats: {
        salaryBefore: '$60K', salaryAfter: '$150K', projects: '3', duration: '8 months',
      },
      company: 'Google',
      rating: '5.0',
      achievement: 'Senior AI Engineer',
      jobType: 'Full-Time',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Data Science Lead',
      title: 'Freelancer to $180K Team Lead',
      description: 'Marcus built his reputation through our platform and was headhunted by a unicorn startup. He now leads a team of 8 data scientists and earns $180K annually with equity.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=400',
      tags: ['Data Science', 'Team Leadership', 'Startup', 'Equity'],
      stats: {
        salary: '$180K', teamSize: '8', equity: '0.5%', duration: '12 months',
      },
      company: 'DataFlow Unicorn',
      rating: '4.9',
      achievement: 'Data Science Lead',
      jobType: 'Full-Time + Equity',
    },
    {
      name: 'Priya Patel',
      role: 'Senior ML Engineer',
      title: 'Remote Work: $120K Global Role',
      description: 'Priya found her perfect remote ML engineering role with a US company through our platform. She works from India, earns $120K USD, and manages international projects.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&h=400',
      tags: ['Remote Work', 'International', 'Machine Learning', 'Global Team'],
      stats: {
        salary: '$120K USD', timezone: 'Global', projects: '12', clients: '5 countries',
      },
      company: 'GlobalTech Solutions',
      rating: '4.8',
      achievement: 'Senior ML Engineer',
      jobType: 'Remote Full-Time',
    },
    {
      name: 'David Kim',
      role: 'AI Consultant',
      title: 'Freelancer to $300K Business Owner',
      description: 'David started as a freelancer on our platform and built a thriving AI consulting business. He now serves Fortune 500 clients and generates $300K+ annually.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&h=400',
      tags: ['AI Consulting', 'Fortune 500', 'Business Owner', 'High-Value Clients'],
      stats: {
        revenue: '$300K+', clients: 'Fortune 500', employees: '12', duration: '18 months',
      },
      company: 'Kim AI Consulting',
      rating: '4.9',
      achievement: 'Founder & CEO',
      jobType: 'Business Owner',
    },
    {
      name: 'Elena Volkov',
      role: 'Computer Vision Engineer',
      title: 'Research to $140K Industry Role',
      description: 'Elena transitioned from academic research to a senior computer vision role at Tesla. She now leads autonomous vehicle projects and earns $140K with stock options.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=400',
      tags: ['Computer Vision', 'Tesla', 'Autonomous Vehicles', 'Stock Options'],
      stats: {
        salary: '$140K', stockOptions: 'Yes', patents: '2', projects: '5',
      },
      company: 'Tesla',
      rating: '4.8',
      achievement: 'Senior CV Engineer',
      jobType: 'Full-Time + Stock',
    },
    {
      name: 'James Thompson',
      role: 'NLP Team Lead',
      title: 'Contractor to $160K Team Lead',
      description: 'James started as a contractor through our platform and was offered a full-time position at Microsoft. He now leads the NLP team and earns $160K with comprehensive benefits.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=400',
      tags: ['Natural Language Processing', 'Microsoft', 'Team Leadership', 'Benefits'],
      stats: {
        salary: '$160K', teamSize: '12', benefits: 'Full', duration: '10 months',
      },
      company: 'Microsoft',
      rating: '4.9',
      achievement: 'NLP Team Lead',
      jobType: 'Full-Time + Benefits',
    },
  ];

  const handleGetStarted = () => {
    navigate('/opportunities');
  };

  return (
    <section id="projects" className="py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <AnimatedSection className="text-center mb-24" direction="up">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg">
              Success Stories
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
            Job Success <span className="text-gradient">Stories</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
            Real professionals who landed high-paying AI jobs, built successful careers,
            and achieved remarkable salary growth through our platform.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {successStories.map((story, index) => (
            <AnimatedCard
              key={index}
              delay={index * 0.1}
              title={story.title}
              description={story.description}
              className="group"
            >
              {/* Person Info */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                  {story.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{story.name}</div>
                  <div className="text-sm text-muted-foreground">{story.role}</div>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-foreground">{story.rating}</span>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  <Award className="w-4 h-4" />
                  {story.achievement}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {story.stats.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-600">{story.stats.salary}</span>
                    </div>
                  )}
                  {story.stats.salaryBefore && story.stats.salaryAfter && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-600">{story.stats.salaryBefore} → {story.stats.salaryAfter}</span>
                    </div>
                  )}
                  {story.stats.revenue && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-600">{story.stats.revenue}</span>
                    </div>
                  )}
                  {story.stats.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{story.stats.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Type Badge */}
              <div className="mt-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <Building className="w-4 h-4" />
                  {story.jobType}
                </div>
              </div>

              {/* Company */}
              <div className="flex items-center gap-2 mt-4">
                <Building className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{story.company}</span>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <GradientButton
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300 font-semibold"
                  onClick={handleGetStarted}
                >
                  Start Your Job Search
                </GradientButton>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* CTA Section */}
        <AnimatedSection className="text-center mt-32" direction="up" delay={0.4}>
          <div className="bg-gradient-primary rounded-3xl p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-display font-black mb-6">
                Land Your Dream AI Job Today
              </h3>
              <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-medium">
                Join thousands of AI professionals who have found high-paying jobs,
                built successful careers, and achieved their salary goals through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <GradientButton
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary font-bold px-12 py-6 text-xl"
                  onClick={handleGetStarted}
                >
                  Find High-Paying Jobs
                </GradientButton>
                <GradientButton
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary font-bold px-12 py-6 text-xl"
                  onClick={handleGetStarted}
                >
                  Apply Now
                </GradientButton>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
