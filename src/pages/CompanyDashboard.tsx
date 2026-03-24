import { motion } from 'framer-motion';
import {
  Building,
  Users,
  Briefcase,
  Plus,
  Settings,
  LogOut,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import { Card } from '../components/ui/card';

export function CompanyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const quickStats = [
    {
      label: 'Active Job Posts', value: '5', icon: Briefcase, color: 'text-blue-600',
    },
    {
      label: 'Total Applications', value: '43', icon: Users, color: 'text-green-600',
    },
    {
      label: 'Interviews Scheduled', value: '8', icon: MessageSquare, color: 'text-purple-600',
    },
    {
      label: 'Hired This Month', value: '3', icon: CheckCircle, color: 'text-orange-600',
    },
  ];

  const recentActivities = [
    { type: 'application', message: 'New application for AI Engineer position', time: '30 minutes ago' },
    { type: 'interview', message: 'Interview completed with Sarah Johnson', time: '2 hours ago' },
    { type: 'posted', message: 'Posted new Machine Learning Specialist role', time: '4 hours ago' },
    { type: 'hired', message: 'Successfully hired John Doe for Computer Vision project', time: '1 day ago' },
  ];

  const activeJobPosts = [
    {
      title: 'Senior AI Engineer', applications: 12, posted: '3 days ago', status: 'Active',
    },
    {
      title: 'Machine Learning Specialist', applications: 8, posted: '1 week ago', status: 'Active',
    },
    {
      title: 'Computer Vision Developer', applications: 15, posted: '2 weeks ago', status: 'Active',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Header */}
        <AnimatedSection direction="up" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Welcome back, {user?.name}! 🏢
              </h1>
              <p className="text-muted-foreground">
                Manage your talent pipeline and grow your AI team.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <GradientButton variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </GradientButton>
              <GradientButton variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </GradientButton>
            </div>
          </div>
        </AnimatedSection>

        {/* Quick Stats */}
        <AnimatedSection direction="up" delay={0.1} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/50 backdrop-blur-md border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-muted/30 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <AnimatedSection direction="up" delay={0.2}>
              <Card className="p-6 bg-white/50 backdrop-blur-md border-white/20">
                <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GradientButton
                    className="justify-start p-4 h-auto"
                    onClick={() => navigate('/opportunities/company')}
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Post New Job</div>
                      <div className="text-sm opacity-80">Find AI talent</div>
                    </div>
                  </GradientButton>
                  {/* <GradientButton variant="outline" className="justify-start p-4 h-auto">
                    <MessageSquare className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Messages</div>
                      <div className="text-sm opacity-80">Chat with candidates</div>
                    </div>
                  </GradientButton> */}

                  <GradientButton
                    variant="outline"
                    className="justify-start p-4 h-auto"
                    onClick={() => navigate('/company-profile')}
                  >
                    <Building className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">View Profile</div>
                      <div className="text-sm opacity-80">Manage company profile</div>
                    </div>
                  </GradientButton>
                </div>
              </Card>
            </AnimatedSection>

            {/* Active Job Posts */}
            <AnimatedSection direction="up" delay={0.3}>
              <Card className="p-6 bg-white/50 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Active Job Posts</h2>
                  <GradientButton size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                  </GradientButton>
                </div>
                <div className="space-y-4">
                  {activeJobPosts.map((job, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{job.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{job.applications} applications</span>
                          <span>Posted {job.posted}</span>
                          <span className="text-green-600">{job.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <GradientButton variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </GradientButton>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedSection>

            {/* Recent Activity */}
            <AnimatedSection direction="up" delay={0.4}>
              <Card className="p-6 bg-white/50 backdrop-blur-md border-white/20">
                <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="p-2 rounded-full bg-primary/20">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-sm">{activity.message}</p>
                        <p className="text-muted-foreground text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Profile */}
            <AnimatedSection direction="up" delay={0.5}>
              <Card className="p-6 bg-white/50 backdrop-blur-md border-white/20">
                <h3 className="text-lg font-semibold text-foreground mb-4">Company Profile</h3>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground">{user?.name}</h4>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-primary font-medium mt-1">Tech Company</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="text-foreground font-medium">92%</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[92%]"></div>
                  </div>
                </div>
                <GradientButton
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => navigate('/company-profile')}
                >
                  View Profile
                </GradientButton>
              </Card>
            </AnimatedSection>

            {/* Hiring Insights */}
            <AnimatedSection direction="up" delay={0.6}>
              <Card className="p-6 bg-white/50 backdrop-blur-md border-white/20">
                <h3 className="text-lg font-semibold text-foreground mb-4">Hiring Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Response Time</span>
                    <span className="text-sm font-medium text-foreground">2.3 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Application Rate</span>
                    <span className="text-sm font-medium text-green-600">↑ 15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interview Rate</span>
                    <span className="text-sm font-medium text-foreground">18.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hire Rate</span>
                    <span className="text-sm font-medium text-foreground">12.8%</span>
                  </div>
                </div>
                <GradientButton size="sm" className="w-full mt-4">
                  View Full Analytics
                </GradientButton>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
