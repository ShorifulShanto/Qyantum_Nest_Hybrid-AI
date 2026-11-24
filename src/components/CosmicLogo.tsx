import React from 'react';

interface CosmicLogoProps {
  className?: string;
  size?: number;
}

export const CosmicLogo: React.FC<CosmicLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 group ${className}`} style={{ width: size, height: size }}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#5DA9FF] via-[#8B5CF6] to-[#F472B6] opacity-75 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />

      {/* Logo Container with Cosmic Gradient Border */}
      <div className="relative w-full h-full rounded-xl cosmic-gradient p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(93,169,255,0.5)]">
        <div className="w-full h-full bg-[#050816] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Orbital Ring Path */}
          <div className="absolute inset-1 rounded-lg border border-[#5DA9FF]/40 rotate-45 scale-90 animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-1.5 rounded-lg border border-[#8B5CF6]/30 -rotate-12 scale-95 animate-[spin_18s_linear_infinite_reverse]" />

          {/* Central 4-point Cosmic Star */}
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-white fill-white drop-shadow-[0_0_8px_rgba(93,169,255,0.9)] z-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
          </svg>

          {/* Orbiting micro-particle */}
          <div className="absolute w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#38BDF8] animate-[spin_6s_linear_infinite]" style={{ transformOrigin: 'center' }} />
        </div>
      </div>
    </div>
  );
};
