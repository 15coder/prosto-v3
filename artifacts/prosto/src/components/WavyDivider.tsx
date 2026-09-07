interface WavyDividerProps {
  className?: string;
  color?: string;
  flip?: boolean;
}

export default function WavyDivider({
  className = '',
  color = 'hsl(46,98%,48%)',
  flip = false,
}: WavyDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-[0] pointer-events-none ${className}`}
      style={{ transform: flip ? 'rotateX(180deg)' : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full"
        style={{ display: 'block', height: '60px' }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="30%" stopColor={color} stopOpacity="0.6" />
            <stop offset="70%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Main wave */}
        <path
          d="M0,40 C120,10 240,70 360,40 C480,10 600,70 720,40 C840,10 960,70 1080,40 C1200,10 1320,70 1440,40 L1440,80 L0,80 Z"
          fill="url(#waveGrad)"
          opacity="0.18"
        />
        {/* Glowing stroke wave */}
        <path
          d="M0,40 C120,10 240,70 360,40 C480,10 600,70 720,40 C840,10 960,70 1080,40 C1200,10 1320,70 1440,40"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.7"
          filter="url(#glow)"
        />
        {/* Second subtler wave offset */}
        <path
          d="M0,55 C180,30 300,75 480,50 C660,25 780,70 960,48 C1100,28 1260,65 1440,45"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
