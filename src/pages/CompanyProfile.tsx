import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  MapPin,
  Globe,
  Users,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Briefcase,
  Award,
  Mail,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '../components/ui/tabs';
import { useToast } from '../components/ui/toast';

export function CompanyProfile() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const mockProfile = {
        user: {
          id: user!.id,
          name: user!.name || 'Company Name',
          email: user!.email,
          bio: user!.bio || 'Add a company description',
          location: 'Add location',
          industry: 'Technology',
          company_size: '10-50',
          website: '',
          founded_year: '',
          description: 'Add a detailed company description',
          mission: 'Add your company mission',
          values: ['Innovation', 'Quality', 'Collaboration'],
          specialties: ['AI/ML', 'Web Development', 'Data Science'],
        },
        opportunities: [],
        team: [],
        achievements: [],
      };
      setProfile(mockProfile);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error loading profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: string, data: any) => {
    setEditing(section);
    setEditData(data);
  };

  const handleSave = async (section: string) => {
    try {
      setProfile((prev: any) => ({
        ...prev,
        user: {
          ...prev.user,
          ...editData,
        },
      }));

      addToast({
        type: 'success',
        title: 'Profile updated successfully',
      });
      setEditing(null);
      setEditData({});
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error updating profile',
      });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setEditData({});
  };

  const getInitials = (name: string) => name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Company profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Company Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-8 bg-white/80 backdrop-blur-md border-white/20 shadow-lg">
            <div className="flex items-start space-x-6">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(profile.user.name || 'Company')}
                </div>
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile.user.name || 'Your Company'}
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                      {profile.user.industry || 'Add industry'}
                    </p>
                  </div>

                  {/* Profile Completion */}
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-2">Profile Completion</div>
                    <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-1">75%</div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.user.location || 'Add location'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{profile.user.company_size || 'Add company size'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{profile.user.founded_year || 'Add founded year'}</span>
                  </div>
                </div>

                {/* Company Description */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">About</h3>
                    {editing !== 'basic' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit('basic', {
                          industry: profile.user.industry,
                          company_size: profile.user.company_size,
                          founded_year: profile.user.founded_year,
                          description: profile.user.description,
                          mission: profile.user.mission,
                        })}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {editing === 'basic' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Industry"
                          value={editData.industry || ''}
                          onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                        />
                        <Input
                          placeholder="Company Size"
                          value={editData.company_size || ''}
                          onChange={(e) => setEditData({ ...editData, company_size: e.target.value })}
                        />
                        <Input
                          placeholder="Founded Year"
                          value={editData.founded_year || ''}
                          onChange={(e) => setEditData({ ...editData, founded_year: e.target.value })}
                        />
                      </div>
                      <Textarea
                        placeholder="Company description..."
                        value={editData.description || ''}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        rows={3}
                      />
                      <Textarea
                        placeholder="Company mission..."
                        value={editData.mission || ''}
                        onChange={(e) => setEditData({ ...editData, mission: e.target.value })}
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <Button onClick={() => handleSave('basic')} className="bg-blue-600 hover:bg-blue-700">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-700 leading-relaxed">
                        {profile.user.description || 'Add a detailed company description to tell potential clients and candidates about your company.'}
                      </p>
                      {profile.user.mission && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Mission</h4>
                          <p className="text-gray-700">{profile.user.mission}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Company Profile Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-md border-white/20">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="opportunities" className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Opportunities</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Team</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Achievements</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Values */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Values</h3>
                    <div className="space-y-2">
                      {profile.user.values && profile.user.values.length > 0 ? (
                        profile.user.values.map((value: string, index: number) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2">
                            {value}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No values added yet</p>
                      )}
                    </div>
                  </div>

                  {/* Company Specialties */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h3>
                    <div className="space-y-2">
                      {profile.user.specialties && profile.user.specialties.length > 0 ? (
                        profile.user.specialties.map((specialty: string, index: number) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-2">
                            {specialty}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No specialties added yet</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{profile.user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span>{profile.user.website || 'Add website'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.user.location || 'Add location'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-6">
                        <Building className="w-4 h-4" />
                        <span>{profile.user.founded_year || 'Add founded year'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities">
              <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Posted Opportunities</h3>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Post New Opportunity
                  </Button>
                </div>

                {profile.opportunities && profile.opportunities.length > 0 ? (
                  <div className="space-y-4">
                    {profile.opportunities.map((opp: any) => (
                      <div key={opp.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{opp.title}</h4>
                            <p className="text-gray-600">{opp.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{opp.status}</Badge>
                              <Badge variant="secondary">{opp.type}</Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No opportunities posted yet</p>
                    <p className="text-sm">Start posting opportunities to find great talent</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Team Member
                  </Button>
                </div>

                {profile.team && profile.team.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.team.map((member: any) => (
                      <div key={member.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-gray-600 text-sm">{member.role}</p>
                        <p className="text-gray-500 text-xs">{member.department}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No team members added yet</p>
                    <p className="text-sm">Add your team members to showcase your company culture</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Company Achievements</h3>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Achievement
                  </Button>
                </div>

                {profile.achievements && profile.achievements.length > 0 ? (
                  <div className="space-y-4">
                    {profile.achievements.map((achievement: any) => (
                      <div key={achievement.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                            <p className="text-gray-600">{achievement.description}</p>
                            <p className="text-sm text-gray-500 mt-1">{achievement.date}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No achievements added yet</p>
                    <p className="text-sm">Showcase your company's successes and milestones</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
