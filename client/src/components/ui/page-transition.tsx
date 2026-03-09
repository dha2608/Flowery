'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

// ─── Professional page transition ─────────────────────────────────────────────
// Uses subtle opacity + y shift. Exit is faster than enter (feels responsive).
// Spring physics on enter, tween on exit (clean disappearance).

const enterTransition = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 250,
  mass: 0.8,
};

const _exitTransition = {
  duration: 0.15,
  ease: [0.4, 0, 1, 1] as const,
};

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={enterTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Reusable animation variants ───────────────────────────────────────────────

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: enterTransition,
  },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: enterTransition,
  },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: enterTransition,
  },
};

export const slideInRight = {
  initial: { opacity: 0, x: 24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: enterTransition,
  },
};

// ─── FadeInOnScroll ────────────────────────────────────────────────────────────

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function FadeInOnScroll({
  children,
  className,
  delay = 0,
  direction = 'up',
}: FadeInOnScrollProps) {
  const prefersReduced = useReducedMotion();

  const directionOffset = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { y: 0, x: 20 },
    right: { y: 0, x: -20 },
  };

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={prefersReduced ? { duration: 0 } : { ...enterTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerContainer ──────────────────────────────────────────────────────────

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}

export function StaggerContainer({
  children,
  className,
  delayChildren = 0.05,
  staggerChildren = 0.06,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: { staggerChildren, delayChildren },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}

// ─── ScaleOnHover ──────────────────────────────────────────────────────────────

export function ScaleOnHover({
  children,
  className,
  scale = 1.015,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      whileHover={prefersReduced ? {} : { scale }}
      whileTap={prefersReduced ? {} : { scale: 0.985 }}
      transition={{ type: 'spring', damping: 20, stiffness: 400 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
