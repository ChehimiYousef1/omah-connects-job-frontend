import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Button } from './button';
import { cn } from './utils';

interface GradientButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function GradientButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
}: GradientButtonProps) {
  const baseClasses = cn(
    'relative overflow-hidden font-medium transition-all duration-300 rounded-2xl',
    'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg shadow-md': variant === 'primary',
      'bg-gradient-to-r from-accent to-primary text-white hover:shadow-lg shadow-md': variant === 'secondary',
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-md': variant === 'outline',
      'bg-transparent text-primary hover:bg-primary/10': variant === 'ghost',
    },
    {
      'px-4 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-base': size === 'md',
      'px-8 py-4 text-lg': size === 'lg',
    },
    className,
  );

  return (
    <Button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {icon && iconPosition === 'left' && !loading && (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {icon}
          </motion.div>
        )}

        <motion.div
          initial={{ y: 0 }}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {children}
        </motion.div>

        {icon && iconPosition === 'right' && !loading && (
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </Button>
  );
}
