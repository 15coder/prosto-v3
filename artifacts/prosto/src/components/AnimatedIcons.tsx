import { motion } from 'framer-motion';

// Animated Heart — heartbeat pulse
export function HeartIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      animate={{ scale: [1, 1.25, 1, 1.12, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
    >
      <defs>
        <radialGradient id="heartGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(46,98%,70%)" />
          <stop offset="100%" stopColor="hsl(10,90%,55%)" />
        </radialGradient>
      </defs>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="url(#heartGrad)"
        filter="drop-shadow(0 0 4px rgba(245,200,0,0.6))"
      />
    </motion.svg>
  );
}

// Animated Star — twinkle rotation
export function StarIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.15, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(46,98%,75%)" />
          <stop offset="100%" stopColor="hsl(46,98%,45%)" />
        </linearGradient>
      </defs>
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="url(#starGrad)"
        filter="drop-shadow(0 0 5px rgba(245,200,0,0.8))"
      />
    </motion.svg>
  );
}

// Animated Flame — flicker effect
export function FlameIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="hsl(10,90%,55%)" />
          <stop offset="50%" stopColor="hsl(36,98%,55%)" />
          <stop offset="100%" stopColor="hsl(46,98%,70%)" />
        </linearGradient>
      </defs>
      {/* Outer flame */}
      <motion.path
        d="M12 2C9.5 5 8 7.5 8 10.5c0 2.2 1.1 4.2 2.8 5.4C10.3 14.3 10 13 10 11.5c0-2 1-3.8 2-5.5 1 1.7 2 3.5 2 5.5 0 1.5-.3 2.8-.8 3.9C14.9 14.7 16 12.7 16 10.5c0-3-1.5-5.5-4-8.5z"
        fill="url(#flameGrad)"
        animate={{ scaleY: [1, 1.08, 0.95, 1.05, 1], skewX: [0, 2, -1, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center bottom' }}
        filter="drop-shadow(0 0 5px rgba(245,150,0,0.7))"
      />
      {/* Inner bright core */}
      <motion.path
        d="M12 8c-1 2-1.5 3.5-1.5 5 0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5C13.5 11.5 13 10 12 8z"
        fill="hsl(46,98%,85%)"
        animate={{ opacity: [0.8, 1, 0.7, 0.9, 0.8] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}
