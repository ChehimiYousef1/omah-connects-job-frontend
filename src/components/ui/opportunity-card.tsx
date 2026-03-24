import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building, MapPin, Calendar, DollarSign, Clock, FileText, CheckCircle, X,
} from 'lucide-react';
import { Badge } from './badge';
import { GradientButton } from './gradient-button';
import { ApplicationDialog } from '../ApplicationDialog';
import { useAuth } from '../../contexts/AuthContext';
import type { Opportunity } from '../../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  showApplyButton?: boolean;
}

// ─── localStorage helpers ────────────────────────────────────────────────────

const APPLICATIONS_KEY = 'mock_db_applications';

type ApplicationRecord = {
  id: string;
  opportunityId: string;
  userId: string;
  coverLetter?: string;
  appliedAt: string;
};

const loadApplications = (): ApplicationRecord[] => {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    return raw ? (JSON.parse(raw) as ApplicationRecord[]) : [];
  } catch {
    return [];
  }
};

const hasUserApplied = (opportunityId: string, userId: string): boolean =>
  loadApplications().some(
    (a) => a.opportunityId === opportunityId && a.userId === userId,
  );

// ─── Component ────────────────────────────────────────────────────────────────

export function OpportunityCard({
  opportunity,
  onDelete,
  showActions = false,
  showApplyButton = true,
}: OpportunityCardProps) {
  const { user } = useAuth();
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isCheckingApplication, setIsCheckingApplication] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'FREELANCER' || !showApplyButton) return;

    setIsCheckingApplication(true);
    try {
      setHasApplied(hasUserApplied(opportunity.id, user.id));
    } catch (err) {
      console.error('Error checking application status:', err);
    } finally {
      setIsCheckingApplication(false);
    }
  }, [opportunity.id, user, showApplyButton]);

  const handleApplySuccess = () => {
    setHasApplied(true);
  };

  // ─── Formatters ─────────────────────────────────────────────────────────────

  const formatBudget = (): string => {
    const { budget_min, budget_max, budget_currency } = opportunity;
    if (budget_min && budget_max) {
      return `${budget_currency} ${budget_min.toLocaleString()} – ${budget_max.toLocaleString()}`;
    }
    if (budget_min) return `${budget_currency} ${budget_min.toLocaleString()}+`;
    if (budget_max) return `${budget_currency} Up to ${budget_max.toLocaleString()}`;
    return 'Budget not specified';
  };

  const getExperienceColor = (level: string): string => {
    const colors: Record<string, string> = {
      ENTRY: 'bg-green-100 text-green-800',
      INTERMEDIATE: 'bg-blue-100 text-blue-800',
      SENIOR: 'bg-purple-100 text-purple-800',
      EXPERT: 'bg-red-100 text-red-800',
    };
    return colors[level] ?? 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      FULL_TIME: 'bg-blue-100 text-blue-800',
      PART_TIME: 'bg-green-100 text-green-800',
      CONTRACT: 'bg-orange-100 text-orange-800',
      FREELANCE: 'bg-purple-100 text-purple-800',
    };
    return colors[type] ?? 'bg-gray-100 text-gray-800';
  };

  const canApply =
    user?.role === 'FREELANCER' &&
    opportunity.status === 'ACTIVE' &&
    !hasApplied;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
              {opportunity.title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Building className="w-4 h-4" />
              <span>Company</span>
            </div>
          </div>

          <Badge
            variant={opportunity.status === 'ACTIVE' ? 'default' : 'secondary'}
            className="ml-2"
          >
            {opportunity.status.toLowerCase()}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {opportunity.description}
        </p>

        {/* Skills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {opportunity.required_skills.slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {opportunity.required_skills.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{opportunity.required_skills.length - 5} more
            </Badge>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{opportunity.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{opportunity.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 shrink-0" />
            <span>{formatBudget()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Type & Experience Badges */}
        <div className="flex gap-2 mb-6">
          <Badge className={getTypeColor(opportunity.type)}>
            {opportunity.type.replace(/_/g, ' ').toLowerCase()}
          </Badge>
          <Badge className={getExperienceColor(opportunity.experience_level)}>
            {opportunity.experience_level.replace(/_/g, ' ').toLowerCase()}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="bg-muted/30 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-foreground mb-2">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground">{opportunity.contact_email}</span>
            </div>

            {/* ✅ Fixed: restored missing opening <a> tag */}
            {opportunity.contact_linkedin && (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">LinkedIn:</span>
                <a
                  href={opportunity.contact_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Apply — Freelancers only */}
          {showApplyButton && user?.role === 'FREELANCER' && (
            hasApplied ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Applied</span>
              </div>
            ) : (
              <GradientButton
                onClick={() => setIsApplicationDialogOpen(true)}
                disabled={!canApply || isCheckingApplication}
                className="flex-1"
                icon={<FileText className="w-4 h-4" />}
              >
                {isCheckingApplication ? 'Checking...' : 'Apply Now'}
              </GradientButton>
            )
          )}

          {/* Delete — Companies only */}
          {showActions && onDelete && user?.role === 'COMPANY' && (
            <button
              type="button"
              onClick={() => onDelete(opportunity.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </motion.div>

      {/* Application Dialog */}
      <ApplicationDialog
        opportunity={opportunity}
        isOpen={isApplicationDialogOpen}
        onClose={() => setIsApplicationDialogOpen(false)}
        onSuccess={handleApplySuccess}
      />
    </>
  );
}