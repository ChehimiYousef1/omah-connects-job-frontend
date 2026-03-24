import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { useIntersectionObserver } from './use-intersection-observer';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  stagger?: number;
  staggerChildren?: boolean;
}

const variants: Record<string, Variants> = {
  up: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  direction = 'up',
  stagger = 0.1,
  staggerChildren = false,
}: AnimatedSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-50px',
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        duration,
        staggerChildren: staggerChildren ? stagger : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      variants={staggerChildren ? containerVariants : variants[direction]}
      initial="hidden"
      animate={isIntersecting ? 'visible' : 'hidden'}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
