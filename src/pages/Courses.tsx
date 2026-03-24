import {
  ArrowLeft, BookOpen, GraduationCap, Users, Clock, Star, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import LogoV1 from '../assets/SVG/Logo v1.svg';

export function Courses() {
  const handleLearnWorldsRedirect = () => {
    window.open('https://openmindsai.learnworlds.com/courses', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 max-w-6xl py-32">
        {/* Logo and Back Button */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <img src={LogoV1} alt="OpenAI Hamburg Logo" className="w-24 h-24" />
              <h1 className="text-4xl font-display font-bold text-foreground">Learning Hub</h1>
            </div>
            <Link to="/login">
              <Button variant="outline" className="group">
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        {/* Header Section */}
        <AnimatedSection direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Available Now
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
              AI Learning <span className="text-gradient">Courses</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
              Comprehensive AI education designed for professionals and enthusiasts.
              Master the skills that drive the future of technology.
            </p>
          </div>
        </AnimatedSection>

        {/* Course Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatedSection direction="up" delay={0.3}>
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 group cursor-pointer" onClick={handleLearnWorldsRedirect}>
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">AI Fundamentals</h3>
              <p className="text-muted-foreground mb-6">Core concepts and principles of artificial intelligence</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>8 weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Beginner</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-primary font-semibold group-hover:text-primary/80 transition-colors">
                <span>View Course</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.4}>
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 group cursor-pointer" onClick={handleLearnWorldsRedirect}>
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Machine Learning</h3>
              <p className="text-muted-foreground mb-6">Practical ML algorithms and implementation</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>12 weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Intermediate</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-accent font-semibold group-hover:text-accent/80 transition-colors">
                <span>View Course</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.5}>
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 group cursor-pointer" onClick={handleLearnWorldsRedirect}>
              <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/30 transition-colors">
                <Star className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Advanced AI</h3>
              <p className="text-muted-foreground mb-6">Cutting-edge AI research and applications</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>16 weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Advanced</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-secondary font-semibold group-hover:text-secondary/80 transition-colors">
                <span>View Course</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Available Now Message */}
        <AnimatedSection direction="up" delay={0.6}>
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-12 shadow-lg border border-white/20 max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-accent" />
              <h3 className="text-2xl font-display font-bold text-foreground">
                Courses Available Now
              </h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Our comprehensive AI courses are now live on our learning platform!
              Get access to interactive lessons, hands-on projects, and expert mentorship.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-foreground mb-3">What You'll Get</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Interactive video lessons</li>
                  <li>• Hands-on coding exercises</li>
                  <li>• Real-world project portfolios</li>
                  <li>• Expert mentorship</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Learning Paths</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• AI Engineer Track</li>
                  <li>• Data Scientist Path</li>
                  <li>• Business AI Specialist</li>
                  <li>• Research & Development</li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection direction="up" delay={0.7} className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl p-8 border border-white/20">
            <h3 className="text-3xl font-display font-bold text-foreground mb-4">
              Start Learning Today
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              Access our complete course catalog and start your AI learning journey.
            </p>
            <GradientButton
              className="bg-white text-primary hover:bg-white/95 font-bold px-8 py-4 text-lg"
              onClick={handleLearnWorldsRedirect}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Go to Learning Platform
            </GradientButton>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
