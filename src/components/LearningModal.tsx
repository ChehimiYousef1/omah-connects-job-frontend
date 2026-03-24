import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, BookOpen, Sparkles, ExternalLink,
} from 'lucide-react';
import { GradientButton } from './ui/gradient-button';

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

export function LearningModal({ isOpen, onClose, onDismiss }: LearningModalProps) {
  const [showDismissOption, setShowDismissOption] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show dismiss option after 3 seconds
      const timer = setTimeout(() => setShowDismissOption(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleGoToLearning = () => {
    onClose();
    window.open('https://openmindsai.learnworlds.com/courses', '_blank');
  };

  const handleDismiss = () => {
    onDismiss();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-display font-bold text-foreground mb-3"
              >
                Accelerate Your Growth
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6 leading-relaxed"
              >
                Explore our Learning Hub to gain skills and boost your profile.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <GradientButton
                  onClick={handleGoToLearning}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Learning Platform
                </GradientButton>
              </motion.div>

              {/* Dismiss option */}
              <AnimatePresence>
                {showDismissOption && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={handleDismiss}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                  >
                    Don't show again this session
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
