import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, Award, Users, Clock, Star, ExternalLink,
} from 'lucide-react';
import { AnimatedSection } from './ui/animated-section';
import { GradientButton } from './ui/gradient-button';

export function Education() {
  const courses = [
    {
      title: 'AI Fundamentals & Machine Learning',
      description: 'Master the basics of artificial intelligence and machine learning algorithms with hands-on projects.',
      duration: '8 weeks',
      level: 'Beginner',
      students: '1,200+',
      rating: '4.9',
      price: '€299',
      features: ['Python programming', 'ML algorithms', 'Data preprocessing', 'Model evaluation'],
    },
    {
      title: 'Advanced Deep Learning & Neural Networks',
      description: 'Dive deep into neural networks, convolutional networks, and transformer architectures.',
      duration: '12 weeks',
      level: 'Advanced',
      students: '850+',
      rating: '4.8',
      price: '€499',
      features: ['TensorFlow & PyTorch', 'CNN & RNN', 'Transformer models', 'GPU optimization'],
    },
    {
      title: 'Business AI Strategy & Implementation',
      description: 'Learn how to develop and implement AI strategies that drive business value and ROI.',
      duration: '6 weeks',
      level: 'Intermediate',
      students: '650+',
      rating: '4.9',
      price: '€399',
      features: ['AI strategy planning', 'ROI analysis', 'Implementation roadmap', 'Change management'],
    },
    {
      title: 'Natural Language Processing & Chatbots',
      description: 'Build intelligent conversational AI systems and NLP applications for real-world use cases.',
      duration: '10 weeks',
      level: 'Intermediate',
      students: '950+',
      rating: '4.7',
      price: '€449',
      features: ['Text processing', 'Sentiment analysis', 'Chatbot development', 'API integration'],
    },
    {
      title: 'AI Ethics & Responsible Development',
      description: 'Understand the ethical implications of AI and learn to build responsible AI systems.',
      duration: '4 weeks',
      level: 'All Levels',
      students: '1,500+',
      rating: '4.9',
      price: '€199',
      features: ['AI ethics principles', 'Bias detection', 'Privacy protection', 'Compliance frameworks'],
    },
    {
      title: 'AI for Business Intelligence & Analytics',
      description: 'Transform data into actionable insights with AI-powered analytics and visualization tools.',
      duration: '8 weeks',
      level: 'Intermediate',
      students: '750+',
      rating: '4.8',
      price: '€349',
      features: ['Data visualization', 'Predictive analytics', 'Dashboard creation', 'Business metrics'],
    },
  ];

  const handleLearnWorldsRedirect = () => {
    window.open('https://openmindsai.learnworlds.com/courses', '_blank');
  };

  return (
    <section id="education" className="py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <AnimatedSection className="text-center mb-24" direction="up">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg">
              Education & Training
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
            Master the <span className="text-gradient">Future of AI</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
            Comprehensive AI training programs designed to equip you with the skills
            and knowledge needed to thrive in the AI-driven economy.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 group"
            >
              {/* Course Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-foreground">{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {course.title}
                </h3>

                <p className="text-muted-foreground text-base leading-relaxed mb-6">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">{course.duration}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Duration</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">{course.level}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Level</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">{course.students}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Students</span>
                </div>
              </div>

              {/* Course Features */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-foreground mb-3">What you'll learn:</h4>
                <ul className="space-y-2">
                  {course.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-display font-bold text-primary">{course.price}</span>
                  <span className="text-sm text-muted-foreground ml-2">one-time</span>
                </div>
                <GradientButton
                  variant="outline"
                  size="sm"
                  className="group-hover:bg-primary group-hover:text-white transition-colors duration-300 font-semibold"
                  onClick={handleLearnWorldsRedirect}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Course
                </GradientButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <AnimatedSection className="text-center mt-32" direction="up" delay={0.4}>
          <div className="bg-gradient-primary rounded-3xl p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-display font-black mb-6">
                Ready to Transform Your Career?
              </h3>
              <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-medium">
                Join thousands of professionals who have already mastered AI skills
                and are leading the digital transformation in their organizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <GradientButton
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary hover:bg-white/95 font-bold px-12 py-6 text-xl"
                  onClick={handleLearnWorldsRedirect}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Browse All Courses
                </GradientButton>
                <GradientButton
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary font-bold px-12 py-6 text-xl"
                  onClick={handleLearnWorldsRedirect}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Get Free Consultation
                </GradientButton>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
