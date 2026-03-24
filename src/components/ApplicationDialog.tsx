import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, AlertCircle, CheckCircle, User, FileText, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApplicationService, type ApplicationData } from '../services/applicationService';
import { GradientButton } from './ui/gradient-button';
import { Badge } from './ui/badge';
import { useToast } from './ui/toast';
import type { Opportunity } from '../types/supabase';

interface ApplicationDialogProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplicationDialog({
  opportunity, isOpen, onClose, onSuccess,
}: ApplicationDialogProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);
    setRequiresProfileCompletion(false);

    if (!user) {
      setError('You must be logged in to apply');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Validate application
      const validationResult = await ApplicationService.validateApplication(
        opportunity.id,
        user.id,
        user.role,
      );

      if (!validationResult.canApply) {
        if (validationResult.requiresProfileCompletion) {
          setRequiresProfileCompletion(true);
        } else {
          setValidationError(validationResult.error || 'Application validation failed');
        }
        setIsSubmitting(false);
        return;
      }

      // Step 2: Create application
      const applicationData: ApplicationData = {
        opportunityId: opportunity.id,
        coverLetter: coverLetter.trim() || undefined,
      };

      const result = await ApplicationService.createApplication(applicationData, user.id);

      if (result.success) {
        // Success! Show toast and close dialog
        addToast({
          type: 'success',
          title: 'Application Submitted!',
          message: `Your application for "${opportunity.title}" has been sent successfully.`,
        });
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Failed to submit application');
        addToast({
          type: 'error',
          title: 'Application Failed',
          message: result.error || 'Failed to submit application',
        });
      }
    } catch (error) {
      console.error('Application submission error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Application Error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCoverLetter('');
      setError(null);
      setValidationError(null);
      setRequiresProfileCompletion(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Apply to Opportunity</h2>
                <p className="text-white/80 mt-1">{opportunity.title}</p>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Opportunity Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Opportunity Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">{opportunity.type.replace('_', ' ').toLowerCase()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Experience:</span>
                  <span className="ml-2 font-medium">{opportunity.experience_level.replace('_', ' ').toLowerCase()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-medium">{opportunity.duration}</span>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{opportunity.location || 'Remote'}</span>
                </div>
              </div>
              {opportunity.budget_min && opportunity.budget_max && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-gray-600">Budget:</span>
                  <span className="ml-2 font-medium">
                    {opportunity.budget_currency} {opportunity.budget_min.toLocaleString()} - {opportunity.budget_max.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Your Profile Summary */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Profile (Auto-attached)
              </h3>
              <div className="text-sm text-blue-800">
                <p>Name: <span className="font-medium">{user?.name || 'Not provided'}</span></p>
                <p>Email: <span className="font-medium">{user?.email}</span></p>
                <p>Role: <span className="font-medium">{user?.role}</span></p>
                {user?.bio && <p>Bio: <span className="font-medium">{user.bio}</span></p>}
              </div>
            </div>

            {/* Error Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            )}

            {validationError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Cannot Apply</span>
                </div>
                <p className="text-red-600 mt-1">{validationError}</p>
              </div>
            )}

            {requiresProfileCompletion && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Profile Incomplete</span>
                </div>
                <p className="text-yellow-600 mt-1">
                  Please complete your profile before applying to opportunities.
                  <button
                    onClick={() => {
                      // Navigate to profile completion page
                      window.location.href = '/profile';
                    }}
                    className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                  >
                    Complete Profile
                  </button>
                </p>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                    placeholder="Tell the company why you're the perfect fit for this opportunity..."
                    disabled={isSubmitting || !!validationError || requiresProfileCompletion}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Your profile information will be automatically attached to this application.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <GradientButton
                  type="submit"
                  disabled={isSubmitting || !!validationError || requiresProfileCompletion}
                  className="flex-1"
                  icon={isSubmitting ? undefined : <Send className="w-4 h-4" />}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </GradientButton>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Success Message */}
            {!error && !validationError && !requiresProfileCompletion && (
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Ready to apply!</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Your profile information will be automatically included with your application.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
