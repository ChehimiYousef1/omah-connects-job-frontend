import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Award,
  Target,
  MessageSquare,
  FileText,
  User,
  BookOpen,
} from 'lucide-react';
import { GradientButton } from '../components/ui/gradient-button';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseTest } from '../components/DatabaseTest';

export function FreelancerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    applications: 0,
    completedProjects: 0,
    totalEarnings: 0,
    activeProjects: 0,
  });

  // Mock data - replace with real API calls
  useEffect(() => {
    setStats({
      applications: 12,
      completedProjects: 8,
      totalEarnings: 15420,
      activeProjects: 2,
    });
  }, []);

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      title: 'Applied to AI Chatbot Development',
      company: 'TechCorp',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'project',
      title: 'Machine Learning Model Completed',
      company: 'DataFlow Inc',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      company: 'InnovateTech',
      time: '3 days ago',
      status: 'completed',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'project':
        return <Target className="w-4 h-4 text-green-600" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-purple-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'Freelancer'}! 👋
          </h1>
          <p className="text-lg text-white/80">
            Here's what's happening with your freelance career today.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GradientButton
              className="justify-start p-4 h-auto"
              onClick={() => navigate('/opportunities/freelancer')}
            >
              <Search className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Browse Opportunities</div>
                <div className="text-sm opacity-80">Find new AI projects</div>
              </div>
            </GradientButton>

            <GradientButton
              className="justify-start p-4 h-auto"
              onClick={() => navigate('/profile')}
            >
              <User className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">View Profile</div>
                <div className="text-sm opacity-80">Manage your professional profile</div>
              </div>
            </GradientButton>

            <GradientButton
              className="justify-start p-4 h-auto"
              onClick={() => window.open('https://openmindsai.learnworlds.com/courses', '_blank')}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Browse Courses</div>
                <div className="text-sm opacity-80">Enhance your AI skills</div>
              </div>
            </GradientButton>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(stats).map(([key, value]) => (
              <Card key={key} className="p-6 bg-white/50 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/30 ${key === 'totalEarnings' ? 'text-purple-600' : key === 'activeProjects' ? 'text-blue-600' : key === 'completedProjects' ? 'text-green-600' : 'text-blue-600'}`}>
                    {key === 'totalEarnings' ? <DollarSign className="w-6 h-6" /> : key === 'activeProjects' ? <Briefcase className="w-6 h-6" /> : key === 'completedProjects' ? <Star className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <Card key={activity.id} className="p-4 bg-white/50 backdrop-blur-md border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-accent/20">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm font-medium">{activity.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">{activity.company}</p>
                    <Badge variant="secondary" className={getStatusColor(activity.status)}>{activity.status}</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs mt-1">{activity.time}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recommended Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
          <div className="space-y-3">
            <Card className="p-4 bg-white/50 backdrop-blur-md border-white/20">
              <h4 className="font-medium text-foreground text-sm">AI Model Optimization</h4>
              <p className="text-xs text-muted-foreground">TechFlow Inc. • $5,000-$8,000</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-muted-foreground">95% match</span>
              </div>
            </Card>
            <Card className="p-4 bg-white/50 backdrop-blur-md border-white/20">
              <h4 className="font-medium text-foreground text-sm">Computer Vision Project</h4>
              <p className="text-xs text-muted-foreground">DataCorp • $3,000-$5,000</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-muted-foreground">88% match</span>
              </div>
            </Card>
          </div>
          <GradientButton size="sm" className="w-full mt-4">
            View All Opportunities
          </GradientButton>
        </motion.div>

        {/* Database Test Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <DatabaseTest />
        </motion.div>
      </div>
    </div>
  );
}
