import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from './card';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  icon?: ReactNode;
  title: string;
  description: string;
  features?: string[];
}

export function AnimatedCard({
  children,
  className = '',
  delay = 0,
  icon,
  title,
  description,
  features = [],
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
    >
      <Card className={`group hover:shadow-glow-lg transition-all duration-300 border border-border hover:border-accent/50 bg-white/80 backdrop-blur-sm ${className}`}>
        <CardHeader>
          {icon && (
            <motion.div
              className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md"
              whileHover={{ rotate: 5 }}
            >
              <div className="text-white text-2xl">
                {icon}
              </div>
            </motion.div>
          )}
          <CardTitle className="text-xl font-display font-semibold text-primary mb-3">
            {title}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {features.length > 0 && (
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + (index * 0.1) }}
                >
                  <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                  {feature}
                </motion.li>
              ))}
            </ul>
          )}
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
