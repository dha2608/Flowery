'use client';

import { motion, useInView, useReducedMotion, type Transition } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

// ─── Professional easing & spring presets ──────────────────────────────────────
// Spring physics feel more natural than cubic-bezier for UI entrances.
// Damping controls overshoot, stiffness controls speed.

const spring = {
  /** Gentle entrance — cards, sections, general content */
  gentle: { type: 'spring', damping: 30, stiffness: 200, mass: 0.8 } as const,
  /** Snappy — buttons, badges, small elements */
  snappy: { type: 'spring', damping: 25, stiffness: 400, mass: 0.5 } as const,
  /** Smooth — large hero elements, page-level */
  smooth: { type: 'spring', damping: 35, stiffness: 150, mass: 1 } as const,
};

// Duration-based fallback for reduced-motion users
const reducedMotionTransition: Transition = { duration: 0, delay: 0 };

// ─── ScrollReveal ──────────────────────────────────────────────────────────────

type RevealVariant = 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideLeft' | 'slideRight';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  once?: boolean;
  threshold?: number;
  /** Override spring preset */
  springPreset?: keyof typeof spring;
}

const revealOffsets: Record<
  RevealVariant,
  { opacity: number; y?: number; x?: number; scale?: number }
> = {
  fadeUp: { opacity: 0, y: 24 },
  fadeIn: { opacity: 0 },
  scaleIn: { opacity: 0, scale: 0.95 },
  slideLeft: { opacity: 0, x: -32 },
  slideRight: { opacity: 0, x: 32 },
};

export function ScrollReveal({
  children,
  className,
  variant = 'fadeUp',
  delay = 0,
  once = true,
  threshold = 0.15,
  springPreset = 'gentle',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const prefersReduced = useReducedMotion();

  const hidden = revealOffsets[variant];
  const visible = { opacity: 1, y: 0, x: 0, scale: 1 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={prefersReduced ? visible : hidden}
      animate={isInView ? visible : hidden}
      transition={prefersReduced ? reducedMotionTransition : { ...spring[springPreset], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerReveal ─────────────────────────────────────────────────────────────

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay between each child (seconds) */
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.06,
  once = true,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.1 });
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReduced ? 0 : staggerDelay,
            delayChildren: prefersReduced ? 0 : 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: prefersReduced ? reducedMotionTransition : spring.gentle,
        },
      }}
    >
      {children}
    </motion.div>
  );
}
