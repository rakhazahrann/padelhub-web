'use client';

import * as m from 'motion/react-m';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  whileHover?: boolean;
}

export function AnimatedCard({ 
  children, 
  className, 
  onClick,
  whileHover = true,
}: AnimatedCardProps) {
  return (
    <m.div
      className={className}
      whileHover={whileHover ? { scale: 1.03, y: -4 } : {}}
      whileTap={whileHover ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
    >
      {children}
    </m.div>
  );
}
