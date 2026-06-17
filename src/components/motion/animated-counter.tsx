'use client';

import * as m from 'motion/react-m';
import { useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  prefix = '', 
  suffix = '',
  className 
}: AnimatedCounterProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (current) => 
    prefix + Math.round(current).toLocaleString('id-ID') + suffix
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <m.span className={className}>{display}</m.span>;
}
