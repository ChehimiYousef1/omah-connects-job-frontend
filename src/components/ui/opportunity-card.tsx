import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building, MapPin, Calendar, DollarSign, Users, Clock, FileText, CheckCircle, X,
} from 'lucide-react';
import { Badge } from './badge';
import { GradientButton } from './gradient-button';
import { ApplicationDialog } from '../ApplicationDialog';
import { useAuth } from '../../contexts/AuthContext';
import { ApplicationService } from '../../services/applicationService';
import type { Opportunity } from '../../types/supabase';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  showApplyButton?: boolean;
}

export function OpportunityCard({
  opportunity, onDelete, showActions = false, showApplyButton = true,
}: OpportunityCardProps) {
  const { user } = useAuth();
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState<boolean | null>(null);
  const [isCheckingApplication, setIsCheckingApplication] = useState(false);

  // Check if user has already applied to this opportunity
  const checkApplicationStatus = async () => {
    if (!user || user.role !== 'FREELANCER') return;

    setIsCheckingApplication(true);
    try {
      const result = await ApplicationService.validateApplication(
        opportunity.id,
        user.id,
        user.role,
      );
      setHasApplied(!result.canApply && result.error === 'You have already applied to this opportunity');
    } catch (error) {
      console.error('Error checking application status:', error);
    } finally {
      setIsCheckingApplication(false);
    }
  };

  // Check application status when component mounts
  useState(() => {
    if (showApplyButton && user?.role === 'FREELANCER') {
      checkApplicationStatus();
    }
  });

  const formatBudget = () => {
    if (!opportunity.budget_min && !opportunity.budget_max) {
      return 'Budget not specified';
    }

    if (opportunity.budget_min && opportunity.budget_max) {
      return `${opportunity.budget_currency} ${opportunity.budget_min.toLocaleString()} - ${opportunity.budget_max.toLocaleString()}`;
    }

    if (opportunity.budget_min) {
      return `${opportunity.budget_currency} ${opportunity.budget_min.toLocaleString()}+`;
    }

    if (opportunity.budget_max) {
      return `${opportunity.budget_currency} Up to ${opportunity.budget_max.toLocaleString()}`;
    }

    return 'Budget not specified';
  };

  const getExperienceColor = (level: string) => {
    const colors: Record<string, string> = {
      ENTRY: 'bg-green-100 text-green-800',
      INTERMEDIATE: 'bg-blue-100 text-blue-800',
      SENIOR: 'bg-purple-100 text-purple-800',
      EXPERT: 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      FULL_TIME: 'bg-blue-100 text-blue-800',
      PART_TIME: 'bg-green-100 text-green-800',
      CONTRACT: 'bg-orange-100 text-orange-800',
      FREELANCE: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleApplySuccess = () => {
    setHasApplied(true);
    // You could show a toast notification here
    console.log('Application submitted successfully!');
  };

  const canApply = user?.role === 'FREELANCER' && opportunity.status === 'ACTIVE' && !hasApplied;

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

          {/* Status Badge */}
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
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{opportunity.duration}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{opportunity.location || 'Remote'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>{formatBudget()}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Type and Experience */}
        <div className="flex gap-2 mb-6">
          <Badge className={getTypeColor(opportunity.type)}>
            {opportunity.type.replace('_', ' ').toLowerCase()}
          </Badge>
          <Badge className={getExperienceColor(opportunity.experience_level)}>
            {opportunity.experience_level.replace('_', ' ').toLowerCase()}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="bg-muted/30 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-foreground mb-2">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground">{opportunity.contact_email}</span>
            </div>

            {opportunity.contact_linkedin && (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
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
          {/* Apply Button (for freelancers) */}
          {showApplyButton && user?.role === 'FREELANCER' && (
            <>
              {hasApplied ? (
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
              )}
            </>
          )}

          {/* Delete Button (for companies) */}
          {showActions && onDelete && user?.role === 'COMPANY' && (
            <button
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
