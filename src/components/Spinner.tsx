
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string; // Retained for backwards compatibility with existing props
}

export function Spinner({ size = 'lg', className = '', color }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-40 h-40 sm:w-48 sm:h-48',
  };

  return (
    <>
      <style>{`
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-0.8px); }
        }
        @keyframes dust-fade {
          0% { opacity: 0.8; transform: scale(1) translateX(0); }
          100% { opacity: 0; transform: scale(1.5) translateX(-4px); }
        }
        .anim-bounce {
          animation: subtle-bounce 0.8s ease-in-out infinite;
        }
        .dust {
          opacity: 0;
          animation: dust-fade 1.5s ease-out infinite;
        }
        .dust-1 { animation-delay: 0s; }
        .dust-2 { animation-delay: 0.4s; }
        .dust-3 { animation-delay: 0.8s; }
      `}</style>
      <svg
        viewBox='0 0 100 100'
        className={`${sizeClasses[size]} drop-shadow-2xl overflow-visible ${className}`}
        aria-label='Oklahoma Wagon Loading Spinner'
      >
        <defs>
          {/* Soft glow filter for the sunset/dust vibe */}
          <filter id='oklahoma-glow' x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation='1.5' result='blur' />
            <feComposite in='SourceGraphic' in2='blur' operator='over' />
          </filter>

          {/* Warm amber gradient for the track */}
          <linearGradient id='trackGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#fbbf24' />
            <stop offset='100%' stopColor='#92400e' />
          </linearGradient>
        </defs>

        {/* Base track */}
        <circle cx='50' cy='50' r='24' fill='none' stroke='#292524' strokeWidth='0.5' />

        {/* Animated glowing highlight on the track */}
        <circle
          cx='50' cy='50' r='24' fill='none' stroke='url(#trackGradient)'
          strokeWidth='1.2' strokeLinecap='round' strokeDasharray='45 105.8'
          filter='url(#oklahoma-glow)'
        >
          <animate attributeName='stroke-dashoffset' from='150.8' to='0' dur='3s' repeatCount='indefinite' />
        </circle>

        <g>
          {/* Perfect 360 rotation around the center (50, 50) of the SVG */}
          <animateTransform attributeName='transform' type='rotate' from='0 50 50' to='360 50 50' dur='3s' repeatCount='indefinite' />

          {/* Position Wagon at the top of the track (Radius: 24 -> Center 50 - 24 = 26) */}
          <g transform='translate(50, 26)'>
            {/* Dust Trail Particles */}
            <g fill='#d97706'>
              <circle cx='-7' cy='2' r='0.8' className='dust dust-1' />
              <circle cx='-9' cy='3' r='1.2' className='dust dust-2' />
              <circle cx='-8' cy='1' r='0.6' className='dust dust-3' />
            </g>

            <g className='anim-bounce'>
              {/* Wagon Tongue/Front Attachment */}
              <path d='M 5.5 1.5 L 9 2.5' stroke='#78350f' strokeWidth='0.5' strokeLinecap='round' />

              {/* Wagon Body (Wood) */}
              <path d='M -5 1 L 5.5 1 L 4.5 3 L -5 3 Z' fill='#92400e' stroke='#451a03' strokeWidth='0.3' strokeLinejoin='round' />

              {/* Wagon Cover (Canvas) */}
              <path d='M -6 1 C -6 -5, 6 -5, 6 1 Z' fill='#fef3c7' stroke='#d97706' strokeWidth='0.4' />

              {/* Cover Ribs (Details) */}
              <path d='M -3 1 C -3 -4.5, -3 -4.5, -3 1 M 0 1 C 0 -4.8, 0 -4.8, 0 1 M 3 1 C 3 -4.5, 3 -4.5, 3 1' stroke='#d97706' strokeWidth='0.2' fill='none' opacity='0.6' />
            </g>

            {/* Back Wheel */}
            <g transform='translate(-3.5, 3)'>
              <g>
                <animateTransform attributeName='transform' type='rotate' from='0 0 0' to='360 0 0' dur='1.5s' repeatCount='indefinite' />
                <circle cx='0' cy='0' r='1.8' fill='#292524' stroke='#451a03' strokeWidth='0.4' />
                <line x1='-1.8' y1='0' x2='1.8' y2='0' stroke='#78350f' strokeWidth='0.3' />
                <line x1='0' y1='-1.8' x2='0' y2='1.8' stroke='#78350f' strokeWidth='0.3' />
                <circle cx='0' cy='0' r='0.4' fill='#d97706' />
              </g>
            </g>

            {/* Front Wheel */}
            <g transform='translate(3.5, 3)'>
              <g>
                <animateTransform attributeName='transform' type='rotate' from='0 0 0' to='360 0 0' dur='1.5s' repeatCount='indefinite' />
                <circle cx='0' cy='0' r='1.4' fill='#292524' stroke='#451a03' strokeWidth='0.4' />
                <line x1='-1.4' y1='0' x2='1.4' y2='0' stroke='#78350f' strokeWidth='0.3' />
                <line x1='0' y1='-1.4' x2='0' y2='1.4' stroke='#78350f' strokeWidth='0.3' />
                <circle cx='0' cy='0' r='0.3' fill='#d97706' />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
}

export default Spinner;
