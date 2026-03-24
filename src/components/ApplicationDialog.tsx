import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, CheckCircle, User, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApplicationService, type ApplicationData } from '../services/applicationService';
import { GradientButton } from './ui/gradient-button';
import { useToast } from './ui/toast';
import type { Opportunity } from '../types/db';

interface ApplicationDialogProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplicationDialog({
  opportunity,
  isOpen,
  onClose,
  onSuccess,
}: ApplicationDialogProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false);

  const resetState = () => {
    setCoverLetter('');
    setError(null);
    setValidationError(null);
    setRequiresProfileCompletion(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetState();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (!user) {
      setError('You must be logged in to apply');
      return;
    }

    setIsSubmitting(true);

    try {
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
        return;
      }

      const applicationData: ApplicationData = {
        opportunityId: opportunity.id,
        coverLetter: coverLetter.trim() || undefined,
      };

      const result = await ApplicationService.createApplication(applicationData, user.id);

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Application Submitted!',
          message: `Your application for "${opportunity.title}" has been sent successfully.`,
        });
        resetState();
        onSuccess();
        onClose();
      } else {
        const errorMessage = result.error || 'Failed to submit application';
        setError(errorMessage);
        addToast({
          type: 'error',
          title: 'Application Failed',
          message: errorMessage,
        });
      }
    } catch (err) {
      console.error('Application submission error:', err);
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

  const isFormDisabled = isSubmitting || !!validationError || requiresProfileCompletion;

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Apply to Opportunity</h2>
                  <p className="text-white/80 mt-1">{opportunity.title}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  aria-label="Close dialog"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">

              {/* Opportunity Details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Opportunity Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type</span>
                    <p className="font-medium capitalize mt-0.5">
                      {opportunity.type.replace(/_/g, ' ').toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Experience</span>
                    <p className="font-medium capitalize mt-0.5">
                      {opportunity.experience_level.replace(/_/g, ' ').toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration</span>
                    <p className="font-medium mt-0.5">{opportunity.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location</span>
                    <p className="font-medium mt-0.5">{opportunity.location || 'Remote'}</p>
                  </div>
                </div>
                {opportunity.budget_min && opportunity.budget_max && (
                  <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                    <span className="text-gray-500">Budget</span>
                    <p className="font-medium mt-0.5">
                      {opportunity.budget_currency}{' '}
                      {opportunity.budget_min.toLocaleString()} –{' '}
                      {opportunity.budget_max.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Profile Summary */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Profile (Auto-attached)
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <span className="text-blue-600">Name:</span>{' '}
                    <span className="font-medium">{user?.name || 'Not provided'}</span>
                  </p>
                  <p>
                    <span className="text-blue-600">Email:</span>{' '}
                    <span className="font-medium">{user?.email}</span>
                  </p>
                  <p>
                    <span className="text-blue-600">Role:</span>{' '}
                    <span className="font-medium">{user?.role}</span>
                  </p>
                  {user?.bio && (
                    <p>
                      <span className="text-blue-600">Bio:</span>{' '}
                      <span className="font-medium">{user.bio}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Error: Generic */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-red-700 mb-1">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-semibold">Error</span>
                  </div>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Error: Validation */}
              {validationError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-red-700 mb-1">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-semibold">Cannot Apply</span>
                  </div>
                  <p className="text-sm text-red-600">{validationError}</p>
                </div>
              )}

              {/* Warning: Profile Incomplete */}
              {requiresProfileCompletion && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-yellow-700 mb-1">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-semibold">Profile Incomplete</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Please complete your profile before applying to opportunities.{' '}
                    <Link
                      to="/profile"
                      className="font-medium underline hover:text-yellow-900 transition-colors"
                    >
                      Complete Profile
                    </Link>
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="coverLetter"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Cover Letter{' '}
                    <span className="font-normal text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    <textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                      disabled={isFormDisabled}
                      placeholder="Tell the company why you're the perfect fit for this opportunity..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none disabled:bg-gray-50 disabled:text-gray-400 transition"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Your profile information will be automatically attached to this application.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <GradientButton
                    type="submit"
                    disabled={isFormDisabled}
                    className="flex-1"
                    icon={isSubmitting ? undefined : <Send className="w-4 h-4" />}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </GradientButton>

                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Ready State */}
              {!error && !validationError && !requiresProfileCompletion && (
                <div className="mt-6 flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Ready to apply!</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Your profile information will be automatically included with your application.
                  </p>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}