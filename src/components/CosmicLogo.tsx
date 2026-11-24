import React from 'react';

interface CosmicLogoProps {
  className?: string;
  size?: number;
}

export const CosmicLogo: React.FC<CosmicLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 group ${className}`} style={{ width: size, height: size }}>
      {/* Outer ambient cosmic glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#38BDF8] via-[#8B5CF6] to-[#F472B6] opacity-80 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />

      {/* Logo Container with Cosmic Gradient Border */}
      <div className="relative w-full h-full rounded-xl cosmic-gradient p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)]">
        <div className="w-full h-full bg-[#050816] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle Star Sparkle behind rocket */}
          <div className="absolute top-1 right-1.5 w-1 h-1 bg-white rounded-full animate-ping" />

          {/* SVG Rocket Ship */}
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.9)] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3-2 3-2" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 2-3 2-3" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
};
