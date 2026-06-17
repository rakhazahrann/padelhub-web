'use client';

import * as m from 'motion/react-m';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: 'spring' as const, 
      stiffness: 300, 
      damping: 24 
    },
  },
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className }: StaggerContainerProps) {
  return (
    <m.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: StaggerContainerProps) {
  return (
    <m.div className={className} variants={itemVariants}>
      {children}
    </m.div>
  );
}
