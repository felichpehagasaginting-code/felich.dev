'use client';

import { motion } from 'framer-motion';

type OrbState = 'idle' | 'listening' | 'speaking' | 'thinking';

interface AuraOrbProps {
  state: OrbState;
  size?: number;
  className?: string;
}

// Theme-driven palettes per state (resolved via CSS variables per theme)
const STATE_CONFIG: Record<OrbState, {
  colors: string[];
  ringOpacity: number;
  ringScale: number;
  pulseSpeed: number;
  glowColor: string;
}> = {
  idle: {
    colors: ['var(--brand)', 'var(--brand-strong, var(--brand))', 'var(--brand)'],
    ringOpacity: 0.15,
    ringScale: 1,
    pulseSpeed: 4,
    glowColor: 'var(--brand-bg)',
  },
  listening: {
    colors: ['var(--danger)', 'var(--warning)', 'var(--brand)'],
    ringOpacity: 0.25,
    ringScale: 1.2,
    pulseSpeed: 1.2,
    glowColor: 'var(--brand-bg)',
  },
  speaking: {
    colors: ['var(--success)', 'var(--brand)', 'var(--brand-strong, var(--brand))'],
    ringOpacity: 0.25,
    ringScale: 1.3,
    pulseSpeed: 0.9,
    glowColor: 'var(--brand-bg)',
  },
  thinking: {
    colors: ['var(--warning)', 'var(--brand)', 'var(--brand-strong, var(--brand))'],
    ringOpacity: 0.2,
    ringScale: 1.1,
    pulseSpeed: 1.8,
    glowColor: 'var(--brand-bg)',
  },
};

const NUM_RINGS = 4;

export default function AuraOrb({ state, size = 80, className = '' }: AuraOrbProps) {
  const config = STATE_CONFIG[state];
  const center = size / 2;
  const baseRadius = size * 0.24;

  // Gradient id must be unique per instance
  const gradId = `aura-grad-${state}`;
  const filterId = `aura-blur-${state}`;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Soft ambient glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-700"
        style={{
          boxShadow: `0 0 ${size * 0.2}px ${config.glowColor}`,
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={config.colors[0]} stopOpacity="0.9" />
            <stop offset="50%" stopColor={config.colors[1]} stopOpacity="0.7" />
            <stop offset="100%" stopColor={config.colors[2]} stopOpacity="0.1" />
          </radialGradient>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={size * 0.06} result="blur" />
          </filter>
        </defs>

        {/* Pulsing rings */}
        {Array.from({ length: NUM_RINGS }).map((_, i) => (
          <motion.circle
            key={i}
            cx={center}
            cy={center}
            r={baseRadius}
            fill="none"
            stroke={config.colors[i % config.colors.length]}
            strokeWidth={state === 'speaking' ? 1.5 : 1}
            strokeOpacity={config.ringOpacity - i * 0.05}
            animate={{
              r: [
                baseRadius + i * (size * 0.07),
                baseRadius + i * (size * 0.07) + size * 0.09 * config.ringScale,
                baseRadius + i * (size * 0.07),
              ],
              opacity: [config.ringOpacity - i * 0.05, 0, 0],
            }}
            transition={{
              duration: config.pulseSpeed,
              repeat: Infinity,
              delay: (i * config.pulseSpeed) / NUM_RINGS,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Core orb (blurred glow base) */}
        <motion.circle
          cx={center}
          cy={center}
          r={baseRadius * 0.85}
          fill={`url(#${gradId})`}
          filter={`url(#${filterId})`}
          animate={{
            r: [
              baseRadius * 0.85,
              baseRadius * 0.85 * (state === 'speaking' ? 1.18 : state === 'listening' ? 1.12 : 1.05),
              baseRadius * 0.85,
            ],
          }}
          transition={{
            duration: config.pulseSpeed * 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Core orb (sharp, bright centre) */}
        <motion.circle
          cx={center}
          cy={center}
          r={baseRadius * 0.45}
          fill={config.colors[0]}
          opacity={0.85}
          animate={{
            opacity: [0.75, 1, 0.75],
            r: [
              baseRadius * 0.45,
              baseRadius * 0.45 * (state === 'idle' ? 1 : 1.15),
              baseRadius * 0.45,
            ],
          }}
          transition={{
            duration: config.pulseSpeed * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
}

// ── Mini version for FAB & header ──────────────────────────────────────────
export function AuraOrbMini({ state, size = 36 }: { state: OrbState; size?: number }) {
  return <AuraOrb state={state} size={size} />;
}