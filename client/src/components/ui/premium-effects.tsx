'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Glassmorphism Card ────────────────────────────────────────────────────────

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  intensity?: 'light' | 'medium' | 'strong';
  glow?: boolean;
  glowColor?: string;
}

export function GlassCard({
  children,
  className,
  blur = 'lg',
  intensity = 'medium',
  glow = false,
  glowColor = 'rgba(244, 114, 182, 0.3)',
}: GlassCardProps) {
  const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };
  const intensityMap = {
    light: 'bg-white/20 border-white/30',
    medium: 'bg-white/40 border-white/50',
    strong: 'bg-white/60 border-white/70',
  };

  return (
    <div
      className={cn(
        'rounded-3xl border shadow-xl',
        blurMap[blur],
        intensityMap[intensity],
        glow && 'shadow-2xl',
        className
      )}
      style={glow ? { boxShadow: `0 25px 50px -12px ${glowColor}` } : undefined}
    >
      {children}
    </div>
  );
}

// ─── Animated Gradient Text ────────────────────────────────────────────────────

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className,
  gradient = 'from-rose-500 via-pink-500 to-fuchsia-500',
  animate = true,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradient,
        animate && 'animate-gradient-x bg-[length:200%_auto]',
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Parallax Section ──────────────────────────────────────────────────────────

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

export function ParallaxSection({
  children,
  className,
  speed = 0.5,
  direction = 'up',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const factor = direction === 'up' ? -100 * speed : 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [factor, -factor]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── 3D Hover Card ─────────────────────────────────────────────────────────────

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function Card3D({ children, className, intensity = 15 }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    setRotateY((x / (rect.width / 2)) * intensity);
    setRotateX((-y / (rect.height / 2)) * intensity);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating Particles ────────────────────────────────────────────────────────

interface FloatingParticlesProps {
  particles?: string[];
  count?: number;
  className?: string;
  minSize?: number;
  maxSize?: number;
}

export function FloatingParticles({
  particles = ['✨', '🌸', '💫', '🌺', '⭐'],
  count = 15,
  className,
  minSize = 14,
  maxSize = 28,
}: FloatingParticlesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use seeded positions to avoid hydration mismatch
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic pseudo-random based on index (no Math.random)
        const seed = (i + 1) * 2654435761;
        const hash = (n: number) => ((n >>> 0) % 10000) / 10000;
        return {
          id: i,
          emoji: particles[i % particles.length],
          x: hash(seed) * 100,
          y: hash(seed * 3) * 100,
          size: minSize + hash(seed * 7) * (maxSize - minSize),
          duration: 15 + hash(seed * 13) * 20,
          delay: hash(seed * 17) * 5,
        };
      }),
    [count, particles, minSize, maxSize]
  );

  if (!mounted) return null;

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute opacity-30"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Shimmer Button ────────────────────────────────────────────────────────────

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  onClick?: () => void;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = 'rgba(255,255,255,0.3)',
  onClick,
}: ShimmerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-full px-8 py-4 font-semibold',
        'bg-gradient-to-r from-rose-500 to-pink-600 text-white',
        'shadow-lg shadow-rose-500/30',
        'hover:shadow-xl hover:shadow-rose-500/40',
        'transition-shadow duration-300',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 -z-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.button>
  );
}

// ─── Magnetic Button ───────────────────────────────────────────────────────────

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className, strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Glow Effect ───────────────────────────────────────────────────────────────

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  blur?: number;
}

export function GlowEffect({
  children,
  className,
  color = 'rgba(244, 114, 182, 0.5)',
  blur = 60,
}: GlowEffectProps) {
  return (
    <div className={cn('relative', className)}>
      <motion.div
        className="absolute inset-0 -z-10 rounded-full opacity-50"
        style={{
          background: color,
          filter: `blur(${blur}px)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {children}
    </div>
  );
}

// ─── Counter Animation ─────────────────────────────────────────────────────────

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Spotlight Effect ──────────────────────────────────────────────────────────

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export function Spotlight({ children, className }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative overflow-hidden', className)}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            opacity: 1,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(244, 114, 182, 0.1), transparent 40%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

// ─── Text Reveal Animation ─────────────────────────────────────────────────────

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Animated Border ───────────────────────────────────────────────────────────

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}

export function AnimatedBorder({
  children,
  className,
  borderColor = 'from-rose-500 via-pink-500 to-fuchsia-500',
}: AnimatedBorderProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-3xl p-[2px]', className)}>
      <motion.div
        className={cn('absolute inset-0 bg-gradient-to-r', borderColor)}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: 'center' }}
      />
      <div className="relative rounded-[22px] bg-white">{children}</div>
    </div>
  );
}
