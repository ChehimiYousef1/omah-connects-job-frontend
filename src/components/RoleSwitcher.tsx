import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Building, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ui/toast';
import { switchUserRole, canSwitchToRole } from '../utils/roleManagement';
import { GradientButton } from './ui/gradient-button';

interface RoleSwitcherProps {
  currentRole: string;
  targetRole: 'freelancer' | 'company';
  onSuccess?: () => void;
  onCancel?: () => void;
  showModal?: boolean;
  onClose?: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  targetRole,
  onSuccess,
  onCancel,
  showModal = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleRoleSwitch = async () => {
    if (!user) return;

    setIsSwitching(true);

    try {
      const result = await switchUserRole({
        userId: user.id,
        newRole: targetRole.toUpperCase() as 'FREELANCER' | 'COMPANY',
        currentRole: user.role,
      });

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Role Switched Successfully!',
          message: `You are now a ${targetRole}`,
        });

        onSuccess?.();

        // Navigate to the new role dashboard
        navigate(`/dashboard/${targetRole}`);

        // Refresh the page to update user context
        window.location.reload();
      } else {
        addToast({
          type: 'error',
          title: 'Role Switch Failed',
          message: result.error || 'An error occurred while switching roles',
        });
      }
    } catch (error) {
      console.error('Failed to switch role:', error);
      addToast({
        type: 'error',
        title: 'Role Switch Failed',
        message: 'An unexpected error occurred while switching roles',
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const canSwitch = canSwitchToRole(currentRole, targetRole);

  if (!canSwitch) {
    return null; // Don't render if no switch is needed
  }

  const roleInfo = {
    freelancer: {
      icon: Users,
      label: 'Freelancer',
      description: 'Find AI opportunities and projects',
      color: 'text-accent',
    },
    company: {
      icon: Building,
      label: 'Company',
      description: 'Post opportunities and find AI talent',
      color: 'text-primary',
    },
  };

  const info = roleInfo[targetRole];
  const IconComponent = info.icon;

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 ${info.color} bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              Switch to {info.label}?
            </h3>
            <p className="text-muted-foreground">
              {info.description}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Note:</p>
                <p>This will change your account type from <strong>{currentRole}</strong> to <strong>{targetRole}</strong>.
                This action cannot be undone immediately.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton
              variant="outline"
              size="sm"
              onClick={onCancel || onClose}
              disabled={isSwitching}
            >
              Cancel
            </GradientButton>
            <GradientButton
              size="sm"
              className="bg-primary text-white hover:bg-primary/90"
              onClick={handleRoleSwitch}
              disabled={isSwitching}
            >
              {isSwitching ? 'Switching...' : `Switch to ${info.label}`}
            </GradientButton>
          </div>
        </div>
      </div>
    );
  }

  // Inline switcher
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <GradientButton
        variant="outline"
        size="sm"
        onClick={handleRoleSwitch}
        disabled={isSwitching}
        className="flex items-center gap-2"
      >
        <IconComponent className="w-4 h-4" />
        {isSwitching ? 'Switching...' : `Switch to ${info.label}`}
      </GradientButton>
    </motion.div>
  );
};

// Hook for easy role switching
export const useRoleSwitcher = () => {
  const [showRoleSwitchModal, setShowRoleSwitchModal] = useState(false);
  const [targetRole, setTargetRole] = useState<'freelancer' | 'company'>('freelancer');

  const openRoleSwitchModal = (role: 'freelancer' | 'company') => {
    setTargetRole(role);
    setShowRoleSwitchModal(true);
  };

  const closeRoleSwitchModal = () => {
    setShowRoleSwitchModal(false);
  };

  return {
    showRoleSwitchModal,
    targetRole,
    openRoleSwitchModal,
    closeRoleSwitchModal,
  };
};
