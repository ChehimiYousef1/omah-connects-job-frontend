import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { useToast } from '../components/ui/toast';
import { AnimatedSection } from '../components/ui/animated-section';

export function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement profile update API
      addToast({
        type: 'success',
        title: 'Profile updated successfully',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (user?.role === 'FREELANCER') {
      navigate('/social/feed');
    } else if (user?.role === 'COMPANY') {
      navigate('/social/feed');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pt-20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <AnimatedSection className="mb-8" direction="up">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account preferences and privacy
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Navigation */}
          <AnimatedSection direction="up" delay={0.1}>
            <Card className="p-6 h-fit">
                             <nav className="space-y-2">
                 <a
                   href="#profile"
                   className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
                 >
                   <User className="w-5 h-5" />
                   Profile Settings
                 </a>
               </nav>
            </Card>
          </AnimatedSection>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Settings */}
            <AnimatedSection direction="up" delay={0.2}>
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Profile Settings
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleProfileSave}
                    disabled={loading}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </div>
                    )}
                  </Button>
                </div>
              </Card>
            </AnimatedSection>

          </div>
        </div>
      </div>
    </div>
  );
}
