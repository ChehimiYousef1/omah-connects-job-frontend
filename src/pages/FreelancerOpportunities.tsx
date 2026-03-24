import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Filter, MapPin, DollarSign, Clock, Briefcase, Star, Bookmark, BookmarkCheck, Eye, Calendar, Building, Users,
} from 'lucide-react';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import { OpportunityCard } from '../components/ui/opportunity-card';
import { Badge } from '../components/ui/badge';
import { opportunitiesApi } from '../api/opportunitiesApi';

// Define the Opportunity interface
interface Opportunity {
  id: string;
  title: string;
  description: string;
  required_skills: string[] | string;
  budget_min?: number;
  budget_max?: number;
  budget_currency?: string;
  contact_email: string;
  contact_linkedin?: string;
  deadline?: string;
  duration?: string;
  location?: string;
  type?: string;
  experience_level?: string;
  status: string;
  created_by_id: string;
  created_by_name?: string;
  created_by_email?: string;
  created_at: Date;
  updated_at?: Date;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  showApplyButton?: boolean;
  showActions?: boolean;
  onApply?: (opportunity: Opportunity) => void;
}

export function FreelancerOpportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    skills: string[];
    type: string[];
    experienceLevel: string[];
    budgetRange: { min: number; max: number };
    location: string;
  }>({
    search: '',
    skills: [],
    type: [],
    experienceLevel: [],
    budgetRange: { min: 0, max: 200000 },
    location: '',
  });

  // Available filter options
  const skillOptions = [
    'Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'AI', 'Data Science',
    'TensorFlow', 'PyTorch', 'AWS', 'Docker', 'SQL', 'MongoDB', 'TypeScript', 'Vue.js',
    'Angular', 'NLP', 'Computer Vision', 'Deep Learning', 'Statistics', 'R', 'Tableau',
    'Power BI', 'Git', 'Kubernetes', 'Microservices', 'REST API', 'GraphQL',
  ];

  const typeOptions = ['full-time', 'part-time', 'contract', 'freelance'];
  const experienceOptions = ['entry', 'intermediate', 'senior', 'expert'];

  // Load opportunities on component mount
  useEffect(() => {
    loadOpportunities();
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    applyFilters();
  }, [filters, opportunities]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const result = await opportunitiesApi.getByStatus('ACTIVE');
      if (result.success && result.data) {
        setOpportunities(result.data);
      } else {
        console.error('Failed to load opportunities:', result.error);
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...opportunities];

    // Search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((opp) => opp.title.toLowerCase().includes(searchLower)
        || opp.description.toLowerCase().includes(searchLower)
        || (opp.created_by_name && opp.created_by_name.toLowerCase().includes(searchLower)));
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter((opp) => {
        const oppSkills = typeof opp.required_skills === 'string'
          ? JSON.parse(opp.required_skills)
          : opp.required_skills;

        return filters.skills.some((skill) => oppSkills.some((oppSkill: string) => oppSkill.toLowerCase().includes(skill.toLowerCase())));
      });
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter((opp) => opp.type && filters.type.some((type) => opp.type?.toLowerCase().replace('_', '-') === type.toLowerCase()));
    }

    // Experience level filter
    if (filters.experienceLevel.length > 0) {
      filtered = filtered.filter((opp) => opp.experience_level && filters.experienceLevel.some((level) => opp.experience_level?.toLowerCase() === level.toLowerCase()));
    }

    // Location filter
    if (filters.location.trim()) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter((opp) => opp.location && opp.location.toLowerCase().includes(locationLower));
    }

    // Budget filter
    if (filters.budgetRange.min > 0 || filters.budgetRange.max < 200000) {
      filtered = filtered.filter((opp) => {
        const min = opp.budget_min || 0;
        const max = opp.budget_max || 200000;
        return min >= filters.budgetRange.min && max <= filters.budgetRange.max;
      });
    }

    setFilteredOpportunities(filtered);
  };

  const handleApply = (opportunity: Opportunity) => {
    window.open(
      `mailto:${opportunity.contact_email}?subject=Application for ${opportunity.title}`,
      '_blank',
    );
  };

  const toggleSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

  const toggleExperience = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      experienceLevel: prev.experienceLevel.includes(level)
        ? prev.experienceLevel.filter((l) => l !== level)
        : [...prev.experienceLevel, level],
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      skills: [],
      type: [],
      experienceLevel: [],
      budgetRange: { min: 0, max: 200000 },
      location: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-32">
        {/* Back to Home */}
        <AnimatedSection className="mb-4" direction="up">
          <div className="flex justify-start">
            <GradientButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs"
            >
              ← Back to Home
            </GradientButton>
          </div>
        </AnimatedSection>

        {/* Role Switch */}
        <AnimatedSection className="mb-8" direction="up">
          <div className="flex items-center justify-between bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Viewing as: <span className="text-accent font-semibold">Freelancer</span>
              </span>
            </div>
            <div className="flex gap-2">
              <GradientButton
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.setItem('userRole', 'company');
                  navigate('/opportunities/company');
                }}
                className="text-xs"
                icon={<Building className="w-3 h-3" />}
              >
                Switch to Company
              </GradientButton>
              <GradientButton
                variant="outline"
                size="sm"
                onClick={() => navigate('/opportunities')}
                className="text-xs"
              >
                Change Role
              </GradientButton>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="text-center mb-24" direction="up">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg">
              For Freelancers
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
            Find <span className="text-gradient">Opportunities</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
            Discover exciting AI opportunities from top companies. Find your next project
            and take your career to the next level.
          </p>
        </AnimatedSection>

        {/* Search and Filters */}
        <AnimatedSection className="mb-16" direction="up" delay={0.2}>
          <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Search Bar */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search opportunities, companies, or skills..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                />
              </div>
              <GradientButton
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="px-6"
                icon={<Filter className="w-5 h-5" />}
              >
                Filters
              </GradientButton>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/20 pt-8 space-y-8"
              >
                {/* Skills Filter */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <Badge
                        key={skill}
                        variant={filters.skills.includes(skill) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/10 transition-colors duration-200"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">Job Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {typeOptions.map((type) => (
                      <Badge
                        key={type}
                        variant={filters.type.includes(type) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/10 transition-colors duration-200"
                        onClick={() => toggleType(type)}
                      >
                        {type.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">Experience Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {experienceOptions.map((level) => (
                      <Badge
                        key={level}
                        variant={filters.experienceLevel.includes(level) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/10 transition-colors duration-200"
                        onClick={() => toggleExperience(level)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">Location</h3>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                  />
                </div>

                {/* Budget Range Filter */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">Budget Range (EUR)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.budgetRange.min || ''}
                      onChange={(e) => setFilters((prev) => ({
                        ...prev,
                        budgetRange: { ...prev.budgetRange, min: Number(e.target.value) || 0 },
                      }))}
                      className="px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.budgetRange.max || ''}
                      onChange={(e) => setFilters((prev) => ({
                        ...prev,
                        budgetRange: { ...prev.budgetRange, max: Number(e.target.value) || 200000 },
                      }))}
                      className="px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-end">
                  <GradientButton
                    variant="outline"
                    onClick={clearFilters}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Clear All Filters
                  </GradientButton>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatedSection>

        {/* Results Summary */}
        <AnimatedSection className="mb-8" direction="up" delay={0.3}>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">
              {loading ? 'Loading...' : `${filteredOpportunities.length} opportunities found`}
            </div>
            <div className="flex gap-2">
              {filters.skills.length > 0 && (
                <Badge variant="secondary">
                  {filters.skills.length} skills selected
                </Badge>
              )}
              {filters.type.length > 0 && (
                <Badge variant="secondary">
                  {filters.type.length} types selected
                </Badge>
              )}
              {filters.experienceLevel.length > 0 && (
                <Badge variant="secondary">
                  {filters.experienceLevel.length} levels selected
                </Badge>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading opportunities...</div>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {filters.search || filters.skills.length > 0 || filters.type.length > 0 || filters.experienceLevel.length > 0 || filters.location || filters.budgetRange.min > 0 || filters.budgetRange.max < 200000
                ? 'No opportunities match your search criteria.'
                : 'No opportunities available at the moment.'
              }
            </div>
            {(filters.search || filters.skills.length > 0 || filters.type.length > 0 || filters.experienceLevel.length > 0 || filters.location || filters.budgetRange.min > 0 || filters.budgetRange.max < 200000) && (
              <GradientButton
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </GradientButton>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                showApplyButton={true}
                showActions={false}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <AnimatedSection className="text-center mt-32" direction="up" delay={0.5}>
          <div className="bg-gradient-primary rounded-3xl p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-display font-black mb-6">
                Ready to Apply?
              </h3>
              <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-medium">
                Don't see the perfect opportunity? Create your profile and get notified
                when new opportunities match your skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <GradientButton
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary hover:bg-white/95 font-bold px-12 py-6 text-xl"
                  onClick={() => navigate('/profile')}
                >
                  Create Profile
                </GradientButton>
                <GradientButton
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary font-bold px-12 py-6 text-xl"
                  onClick={() => navigate('/alerts')}
                >
                  Set Up Alerts
                </GradientButton>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
